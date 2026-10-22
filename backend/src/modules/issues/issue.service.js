import prisma from "../../prisma/prisma.js";
import { AppError } from "../../errors/AppError.js";
import { calculateFine, startOfUtcDay } from "./fine-calculator.js";

export const LOAN_PERIOD_DAYS = 14;
export const MAX_ACTIVE_LOANS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const loanInclude = {
  book: { select: { id: true, isbn: true, title: true, author: true } },
  student: { select: { id: true, fullName: true, email: true } },
  issuedBy: { select: { id: true, fullName: true, email: true } },
};

export const issueBookService = async ({ studentUserId, bookId, issuedById }) => {
  const now = new Date();
  const today = startOfUtcDay(now);
  const dueDate = new Date(today.getTime() + LOAN_PERIOD_DAYS * DAY_MS);

  return prisma.$transaction(async (tx) => {
    // Serialize issue requests for one student so concurrent requests cannot bypass the loan limit.
    const lockedUsers = await tx.$queryRaw`SELECT id FROM users WHERE id = ${studentUserId} FOR UPDATE`;
    if (!lockedUsers.length) throw new AppError("Student not found.", 404);

    const student = await tx.user.findUnique({
      where: { id: studentUserId },
      include: { role: true, studentProfile: true },
    });
    if (!student?.studentProfile || student.role?.roleName !== "STUDENT") {
      throw new AppError("The selected user is not a student.", 400);
    }
    if (!student.isActive) throw new AppError("Student account is inactive.", 409);

    const activeLoans = await tx.loan.count({ where: { studentUserId, returnedAt: null } });
    if (activeLoans >= MAX_ACTIVE_LOANS) {
      throw new AppError("A student cannot have more than 3 active loans.", 409);
    }

    const overdueLoan = await tx.loan.findFirst({
      where: { studentUserId, returnedAt: null, dueDate: { lt: today } },
      select: { id: true, dueDate: true },
    });
    if (overdueLoan) throw new AppError("Student has an overdue book and cannot borrow another book.", 409);

    const book = await tx.book.findUnique({ where: { id: bookId } });
    if (!book || !book.isActive) throw new AppError("Book not found.", 404);
    const inventoryUpdate = await tx.book.updateMany({
      where: { id: bookId, isActive: true, availableCopies: { gt: 0 } },
      data: { availableCopies: { decrement: 1 } },
    });
    if (inventoryUpdate.count !== 1) throw new AppError("No copies of this book are currently available.", 409);

    return tx.loan.create({
      data: { studentUserId, bookId, issuedById, issuedAt: now, dueDate },
      include: loanInclude,
    });
  }, { isolationLevel: "ReadCommitted" });
};

export const returnBookService = async (loanId) => {
  const returnedAt = new Date();
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new AppError("Loan record not found.", 404);
    if (loan.returnedAt) throw new AppError("This book has already been returned.", 409);

    const fineAmount = calculateFine(loan.dueDate, returnedAt);
    const updated = await tx.loan.updateMany({
      where: { id: loanId, returnedAt: null },
      data: { returnedAt, fineAmount },
    });
    if (updated.count !== 1) throw new AppError("This book has already been returned.", 409);

    await tx.book.update({
      where: { id: loan.bookId },
      data: { availableCopies: { increment: 1 } },
    });
    return tx.loan.findUnique({ where: { id: loanId }, include: loanInclude });
  });
};

export const getLoansService = async ({ studentUserId, activeOnly = false } = {}) => {
  return prisma.loan.findMany({
    where: {
      ...(studentUserId ? { studentUserId } : {}),
      ...(activeOnly ? { returnedAt: null } : {}),
    },
    include: loanInclude,
    orderBy: [{ returnedAt: "asc" }, { issuedAt: "desc" }],
  });
};

export const getLoanByIdService = async (loanId) => {
  const loan = await prisma.loan.findUnique({ where: { id: loanId }, include: loanInclude });
  if (!loan) throw new AppError("Loan record not found.", 404);
  return loan;
};
