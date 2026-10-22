# Phase 3: Book Issues, Returns, and Fines

All endpoints require `Authorization: Bearer <token>`. Issue and return operations are restricted to `ADMIN` and `LIBRARIAN`. Students can view only their own loan records.

## Issue a book
`POST /api/issues`

```json
{
  "studentUserId": "<student user UUID>",
  "bookId": "<book UUID>"
}
```

The API enforces a 14-calendar-day loan period, a maximum of 3 active loans, no borrowing while a loan is overdue, active student/book status, and available inventory. Due dates are stored as UTC calendar-day boundaries.

## List loans
`GET /api/issues`

Optional query parameters: `studentUserId` (staff only for cross-student filtering) and `activeOnly=true`. Students receive only their own records.

## Get one loan
`GET /api/issues/:loanId`

Students may retrieve only their own loan records.

## Return a book
`POST /api/issues/:loanId/return`

The return operation records the return timestamp, settles and persists the fine, and increments available inventory in one database transaction. Duplicate returns are rejected. The fine is **₹120 per overdue calendar day**; the due date itself is fine-free. For example, due October 20 and returned October 22 = ₹240.

## Database migration
A new additive Prisma migration creates `loans` and foreign keys. It does not drop or rewrite existing tables. Apply it only after reviewing your configured database and taking a backup, using `npx prisma migrate deploy` from `backend`. Regenerate the Prisma client with `npx prisma generate`.
