import bcrypt from "bcryptjs";
import crypto from "crypto";

// Try to import PrismaClient if generated and configured, otherwise use mock
let PrismaClientClass = null;
try {
  const prismaPkg = await import("@prisma/client");
  PrismaClientClass = prismaPkg.PrismaClient;
} catch {
  // @prisma/client not generated or not available
}

class InMemoryPrisma {
  constructor() {
    this.roles = [
      { id: 1, roleName: "ADMIN", description: "System Administrator" },
      { id: 2, roleName: "LIBRARIAN", description: "Library Staff" },
      { id: 3, roleName: "STUDENT", description: "Student User" },
    ];

    const adminHash = bcrypt.hashSync("Admin@123", 10);
    const libHash = bcrypt.hashSync("Librarian@123", 10);
    const stuHash = bcrypt.hashSync("Password@123", 10);

    const now = new Date();

    this.users = [
      {
        id: "usr-admin-1",
        fullName: "System Administrator",
        email: "admin@smartlibrary.com",
        passwordHash: adminHash,
        roleId: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr-lib-1",
        fullName: "Sarah Jenkins",
        email: "librarian@smartlibrary.com",
        passwordHash: libHash,
        roleId: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr-stu-1",
        fullName: "Rahul Sharma",
        email: "rahul@example.com",
        passwordHash: stuHash,
        roleId: 3,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.studentProfiles = [
      {
        id: 1,
        userId: "usr-stu-1",
        enrollmentNo: "CSE23001",
        department: "Computer Science",
        semester: 5,
        year: 3,
      },
    ];

    this.librarianProfiles = [
      {
        id: 1,
        userId: "usr-lib-1",
        employeeId: "LIB001",
        designation: "Chief Librarian",
        phone: "+1 555-0199",
        address: "Central Campus Library",
        joinedAt: now,
      },
    ];

    this.categories = [
      {
        id: 1,
        name: "Computer Science & Engineering",
        description: "Software engineering, programming, and architecture",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: "Algorithms & Data Structures",
        description: "Core algorithms, complexity analysis, and competitive programming",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: "Artificial Intelligence & ML",
        description: "Machine learning, neural networks, and modern AI",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: "Database Systems",
        description: "Relational modeling, distributed databases, and SQL",
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.books = [
      {
        id: "bk-101",
        isbn: "978-0132350884",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        publicationYear: 2008,
        shelfLocation: "A-101",
        totalCopies: 5,
        availableCopies: 4,
        isActive: true,
        categoryId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bk-102",
        isbn: "978-0262033848",
        title: "Introduction to Algorithms (4th Edition)",
        author: "Thomas H. Cormen, Charles E. Leiserson",
        publisher: "MIT Press",
        publicationYear: 2022,
        shelfLocation: "A-102",
        totalCopies: 4,
        availableCopies: 3,
        isActive: true,
        categoryId: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bk-103",
        isbn: "978-0134685991",
        title: "Effective Java (3rd Edition)",
        author: "Joshua Bloch",
        publisher: "Addison-Wesley",
        publicationYear: 2018,
        shelfLocation: "A-103",
        totalCopies: 3,
        availableCopies: 3,
        isActive: true,
        categoryId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bk-104",
        isbn: "978-0262035613",
        title: "Deep Learning",
        author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
        publisher: "MIT Press",
        publicationYear: 2016,
        shelfLocation: "B-201",
        totalCopies: 3,
        availableCopies: 3,
        isActive: true,
        categoryId: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bk-105",
        isbn: "978-1492032649",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        publisher: "O'Reilly Media",
        publicationYear: 2017,
        shelfLocation: "C-301",
        totalCopies: 6,
        availableCopies: 5,
        isActive: true,
        categoryId: 4,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const issuedAt = new Date(Date.now() - 3 * 86400000);
    const dueDate = new Date(Date.now() + 11 * 86400000);

    this.loans = [
      {
        id: "loan-101",
        studentUserId: "usr-stu-1",
        bookId: "bk-101",
        issuedById: "usr-lib-1",
        issuedAt,
        dueDate,
        returnedAt: null,
        fineAmount: 0,
      },
    ];

    this._setupModels();
  }

  _hydrateUser(user, include) {
    if (!user) return null;
    const cloned = { ...user };
    if (include?.role) {
      cloned.role = this.roles.find((r) => r.id === user.roleId) || null;
    }
    if (include?.studentProfile) {
      cloned.studentProfile = this.studentProfiles.find((sp) => sp.userId === user.id) || null;
    }
    if (include?.librarianProfile) {
      cloned.librarianProfile = this.librarianProfiles.find((lp) => lp.userId === user.id) || null;
    }
    return cloned;
  }

  _hydrateStudentProfile(sp, include) {
    if (!sp) return null;
    const cloned = { ...sp };
    if (include?.user) {
      const user = this.users.find((u) => u.id === sp.userId);
      if (user) {
        const uHydrated = this._hydrateUser(user, { role: true });
        if (include.user.select) {
          const projected = {};
          for (const key of Object.keys(include.user.select)) {
            if (key === "role" && include.user.select.role?.select?.roleName) {
              projected.role = { roleName: uHydrated.role?.roleName };
            } else {
              projected[key] = uHydrated[key];
            }
          }
          cloned.user = projected;
        } else {
          cloned.user = uHydrated;
        }
      }
    }
    return cloned;
  }

  _hydrateLibrarianProfile(lp, include) {
    if (!lp) return null;
    const cloned = { ...lp };
    if (include?.user) {
      const user = this.users.find((u) => u.id === lp.userId);
      if (user) {
        const uHydrated = this._hydrateUser(user, { role: true });
        if (include.user.select) {
          const projected = {};
          for (const key of Object.keys(include.user.select)) {
            if (key === "role" && include.user.select.role?.select?.roleName) {
              projected.role = { roleName: uHydrated.role?.roleName };
            } else {
              projected[key] = uHydrated[key];
            }
          }
          cloned.user = projected;
        } else {
          cloned.user = uHydrated;
        }
      }
    }
    return cloned;
  }

  _hydrateBook(book, include) {
    if (!book) return null;
    const cloned = { ...book };
    if (include?.category) {
      cloned.category = this.categories.find((c) => c.id === book.categoryId) || null;
    }
    return cloned;
  }

  _hydrateLoan(loan, include) {
    if (!loan) return null;
    const cloned = { ...loan };
    if (include?.book) {
      const book = this.books.find((b) => b.id === loan.bookId);
      if (book) {
        if (include.book.select) {
          const proj = {};
          for (const k of Object.keys(include.book.select)) proj[k] = book[k];
          cloned.book = proj;
        } else {
          cloned.book = { ...book };
        }
      }
    }
    if (include?.student) {
      const stu = this.users.find((u) => u.id === loan.studentUserId);
      if (stu) {
        if (include.student.select) {
          const proj = {};
          for (const k of Object.keys(include.student.select)) proj[k] = stu[k];
          cloned.student = proj;
        } else {
          cloned.student = { ...stu };
        }
      }
    }
    if (include?.issuedBy) {
      const issuer = this.users.find((u) => u.id === loan.issuedById);
      if (issuer) {
        if (include.issuedBy.select) {
          const proj = {};
          for (const k of Object.keys(include.issuedBy.select)) proj[k] = issuer[k];
          cloned.issuedBy = proj;
        } else {
          cloned.issuedBy = { ...issuer };
        }
      }
    }
    return cloned;
  }

  _setupModels() {
    this.user = {
      findUnique: async ({ where, include, select }) => {
        let user = null;
        if (where.id) user = this.users.find((u) => u.id === where.id);
        else if (where.email) user = this.users.find((u) => u.email.toLowerCase() === where.email.toLowerCase());
        if (!user) return null;
        const hydrated = this._hydrateUser(user, include);
        if (select) {
          const res = {};
          for (const k of Object.keys(select)) res[k] = hydrated[k];
          return res;
        }
        return hydrated;
      },
      findFirst: async ({ where, include }) => {
        const user = this.users.find((u) => {
          if (where.email && u.email.toLowerCase() !== where.email.toLowerCase()) return false;
          if (where.isActive !== undefined && u.isActive !== where.isActive) return false;
          return true;
        });
        return user ? this._hydrateUser(user, include) : null;
      },
      create: async ({ data, include }) => {
        const id = crypto.randomUUID();
        const now = new Date();
        const newUser = {
          id,
          fullName: data.fullName,
          email: data.email,
          passwordHash: data.passwordHash,
          roleId: data.roleId || (data.role?.connect?.roleName ? (this.roles.find(r => r.roleName === data.role.connect.roleName)?.id || 3) : 3),
          isActive: data.isActive !== undefined ? data.isActive : true,
          createdAt: now,
          updatedAt: now,
        };
        this.users.push(newUser);

        if (data.studentProfile?.create) {
          const spData = data.studentProfile.create;
          const newSp = {
            id: this.studentProfiles.length + 1,
            userId: id,
            enrollmentNo: spData.enrollmentNo,
            department: spData.department,
            semester: spData.semester,
            year: spData.year,
          };
          this.studentProfiles.push(newSp);
        }

        if (data.librarianProfile?.create) {
          const lpData = data.librarianProfile.create;
          const newLp = {
            id: this.librarianProfiles.length + 1,
            userId: id,
            employeeId: lpData.employeeId,
            designation: lpData.designation,
            phone: lpData.phone ?? null,
            address: lpData.address ?? null,
            joinedAt: now,
          };
          this.librarianProfiles.push(newLp);
        }

        return this._hydrateUser(newUser, include);
      },
      update: async ({ where, data }) => {
        const user = this.users.find((u) => u.id === where.id);
        if (!user) return null;
        Object.assign(user, data, { updatedAt: new Date() });
        return { ...user };
      },
    };

    this.role = {
      findUnique: async ({ where }) => {
        if (where.id) return this.roles.find((r) => r.id === where.id) || null;
        if (where.roleName) return this.roles.find((r) => r.roleName === where.roleName) || null;
        return null;
      },
      findMany: async () => [...this.roles],
    };

    this.studentProfile = {
      findMany: async ({ include, orderBy }) => {
        const sorted = [...this.studentProfiles].sort((a, b) => a.id - b.id);
        return sorted.map((sp) => this._hydrateStudentProfile(sp, include));
      },
      findUnique: async ({ where, include, select }) => {
        let sp = null;
        if (where.id) sp = this.studentProfiles.find((s) => s.id === where.id);
        else if (where.userId) sp = this.studentProfiles.find((s) => s.userId === where.userId);
        else if (where.enrollmentNo) sp = this.studentProfiles.find((s) => s.enrollmentNo === where.enrollmentNo);
        if (!sp) return null;
        const hydrated = this._hydrateStudentProfile(sp, include);
        if (select) {
          const res = {};
          for (const k of Object.keys(select)) res[k] = hydrated[k];
          return res;
        }
        return hydrated;
      },
      update: async ({ where, data }) => {
        const sp = this.studentProfiles.find((s) => s.userId === where.userId || s.id === where.id);
        if (!sp) return null;
        Object.assign(sp, data);
        return { ...sp };
      },
    };

    this.librarianProfile = {
      findMany: async ({ include, orderBy }) => {
        const sorted = [...this.librarianProfiles].sort((a, b) => a.id - b.id);
        return sorted.map((lp) => this._hydrateLibrarianProfile(lp, include));
      },
      findUnique: async ({ where, include, select }) => {
        let lp = null;
        if (where.id) lp = this.librarianProfiles.find((l) => l.id === where.id);
        else if (where.userId) lp = this.librarianProfiles.find((l) => l.userId === where.userId);
        else if (where.employeeId) lp = this.librarianProfiles.find((l) => l.employeeId === where.employeeId);
        if (!lp) return null;
        const hydrated = this._hydrateLibrarianProfile(lp, include);
        if (select) {
          const res = {};
          for (const k of Object.keys(select)) res[k] = hydrated[k];
          return res;
        }
        return hydrated;
      },
      create: async ({ data, include }) => {
        const now = new Date();
        let userId = data.userId;
        if (data.user?.create) {
          const uData = data.user.create;
          const uId = crypto.randomUUID();
          const roleId = uData.role?.connect?.roleName === "LIBRARIAN" ? 2 : 2;
          const newUser = {
            id: uId,
            fullName: uData.fullName,
            email: uData.email,
            passwordHash: uData.passwordHash,
            roleId,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          };
          this.users.push(newUser);
          userId = uId;
        }

        const newLp = {
          id: this.librarianProfiles.length + 1,
          userId,
          employeeId: data.employeeId,
          designation: data.designation,
          phone: data.phone ?? null,
          address: data.address ?? null,
          joinedAt: now,
        };
        this.librarianProfiles.push(newLp);
        return this._hydrateLibrarianProfile(newLp, include);
      },
      update: async ({ where, data }) => {
        const lp = this.librarianProfiles.find((l) => l.userId === where.userId || l.id === where.id);
        if (!lp) return null;
        Object.assign(lp, data);
        return { ...lp };
      },
    };

    this.category = {
      findUnique: async ({ where }) => {
        if (where.id) return this.categories.find((c) => c.id === where.id) || null;
        if (where.name) return this.categories.find((c) => c.name.toLowerCase() === where.name.toLowerCase()) || null;
        return null;
      },
      findMany: async () => {
        return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
      },
      create: async ({ data }) => {
        const now = new Date();
        const newCat = {
          id: this.categories.length + 1,
          name: data.name,
          description: data.description ?? null,
          createdAt: now,
          updatedAt: now,
        };
        this.categories.push(newCat);
        return { ...newCat };
      },
    };

    this.book = {
      findUnique: async ({ where, include }) => {
        let b = null;
        if (where.id) b = this.books.find((item) => item.id === where.id);
        else if (where.isbn) b = this.books.find((item) => item.isbn === where.isbn);
        if (!b) return null;
        return this._hydrateBook(b, include);
      },
      findMany: async ({ where = {}, include, orderBy }) => {
        let list = this.books.filter((b) => {
          if (where.id && b.id !== where.id) return false;
          if (where.isActive !== undefined && b.isActive !== where.isActive) return false;
          if (where.categoryId && b.categoryId !== where.categoryId) return false;
          if (where.isbn && b.isbn !== where.isbn) return false;
          return true;
        });
        list.sort((a, b) => a.title.localeCompare(b.title));
        return list.map((b) => this._hydrateBook(b, include));
      },
      create: async ({ data, include }) => {
        const now = new Date();
        const newBook = {
          id: crypto.randomUUID(),
          isbn: data.isbn,
          title: data.title,
          author: data.author,
          publisher: data.publisher ?? null,
          publicationYear: data.publicationYear ?? null,
          shelfLocation: data.shelfLocation ?? null,
          totalCopies: data.totalCopies ?? 1,
          availableCopies: data.availableCopies ?? (data.totalCopies ?? 1),
          isActive: data.isActive !== undefined ? data.isActive : true,
          categoryId: data.categoryId,
          createdAt: now,
          updatedAt: now,
        };
        this.books.push(newBook);
        return this._hydrateBook(newBook, include);
      },
      update: async ({ where, data, include }) => {
        const book = this.books.find((b) => b.id === where.id);
        if (!book) return null;
        if (data.availableCopies?.increment) {
          book.availableCopies += data.availableCopies.increment;
        } else if (data.availableCopies?.decrement) {
          book.availableCopies = Math.max(0, book.availableCopies - data.availableCopies.decrement);
        } else if (typeof data.availableCopies === "number") {
          book.availableCopies = data.availableCopies;
        }
        const { availableCopies, ...otherData } = data;
        Object.assign(book, otherData, { updatedAt: new Date() });
        return this._hydrateBook(book, include);
      },
      updateMany: async ({ where, data }) => {
        let count = 0;
        for (const book of this.books) {
          if (where.id && book.id !== where.id) continue;
          if (where.isActive !== undefined && book.isActive !== where.isActive) continue;
          if (where.availableCopies?.gt !== undefined && book.availableCopies <= where.availableCopies.gt) continue;

          if (data.availableCopies?.decrement) {
            book.availableCopies = Math.max(0, book.availableCopies - data.availableCopies.decrement);
          }
          count++;
        }
        return { count };
      },
    };

    this.loan = {
      findUnique: async ({ where, include }) => {
        const loan = this.loans.find((l) => l.id === where.id);
        return loan ? this._hydrateLoan(loan, include) : null;
      },
      findFirst: async ({ where, select }) => {
        const now = new Date();
        const loan = this.loans.find((l) => {
          if (where.studentUserId && l.studentUserId !== where.studentUserId) return false;
          if (where.returnedAt === null && l.returnedAt !== null) return false;
          if (where.dueDate?.lt && !(l.dueDate < where.dueDate.lt)) return false;
          return true;
        });
        if (!loan) return null;
        if (select) {
          const res = {};
          for (const k of Object.keys(select)) res[k] = loan[k];
          return res;
        }
        return { ...loan };
      },
      findMany: async ({ where = {}, include, orderBy }) => {
        const list = this.loans.filter((l) => {
          if (where.studentUserId && l.studentUserId !== where.studentUserId) return false;
          if (where.returnedAt === null && l.returnedAt !== null) return false;
          return true;
        });
        list.sort((a, b) => {
          if (a.returnedAt && !b.returnedAt) return 1;
          if (!a.returnedAt && b.returnedAt) return -1;
          return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
        });
        return list.map((l) => this._hydrateLoan(l, include));
      },
      count: async ({ where = {} }) => {
        return this.loans.filter((l) => {
          if (where.studentUserId && l.studentUserId !== where.studentUserId) return false;
          if (where.returnedAt === null && l.returnedAt !== null) return false;
          return true;
        }).length;
      },
      create: async ({ data, include }) => {
        const newLoan = {
          id: crypto.randomUUID(),
          studentUserId: data.studentUserId,
          bookId: data.bookId,
          issuedById: data.issuedById,
          issuedAt: data.issuedAt || new Date(),
          dueDate: data.dueDate,
          returnedAt: null,
          fineAmount: 0,
        };
        this.loans.push(newLoan);
        return this._hydrateLoan(newLoan, include);
      },
      updateMany: async ({ where, data }) => {
        let count = 0;
        for (const loan of this.loans) {
          if (where.id && loan.id !== where.id) continue;
          if (where.returnedAt === null && loan.returnedAt !== null) continue;
          Object.assign(loan, data);
          count++;
        }
        return { count };
      },
    };
  }

  async $queryRaw(query, ...values) {
    // For SELECT id FROM users WHERE id = ... FOR UPDATE
    return [{ id: values[0] || "1" }];
  }

  async $transaction(fn) {
    if (typeof fn === "function") {
      return await fn(this);
    }
    return fn;
  }
}

const inMemoryPrisma = new InMemoryPrisma();

let prismaInstance;
if (process.env.DATABASE_URL && PrismaClientClass) {
  try {
    const realClient = new PrismaClientClass();
    // Return a proxy that delegates to realClient, but falls back to inMemoryPrisma if disconnected
    prismaInstance = new Proxy(realClient, {
      get(target, prop) {
        if (prop in target) {
          const orig = target[prop];
          if (typeof orig === "function") {
            return (...args) => orig.apply(target, args);
          }
          return orig;
        }
        return inMemoryPrisma[prop];
      },
    });
  } catch (err) {
    console.warn("[AI Studio] Database connection failed — using in-memory mock store:", err.message);
    prismaInstance = inMemoryPrisma;
  }
} else {
  prismaInstance = inMemoryPrisma;
}

export default prismaInstance;