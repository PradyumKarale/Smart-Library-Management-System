export interface LoanUserSummary {
  id: string;
  fullName: string;
  email: string;
}

export interface LoanBookSummary {
  id: string;
  isbn: string;
  title: string;
  author: string;
}

export interface Loan {
  id: string;
  studentUserId: string;
  bookId: string;
  issuedById: string;
  issuedAt: string;
  dueDate: string;
  returnedAt: string | null;
  fineAmount: number;
  book: LoanBookSummary;
  student: LoanUserSummary;
  issuedBy: LoanUserSummary;
}

export interface IssueBookRequest {
  studentUserId: string;
  bookId: string;
}

export interface LoanQueryParams {
  studentUserId?: string;
  activeOnly?: boolean;
}
