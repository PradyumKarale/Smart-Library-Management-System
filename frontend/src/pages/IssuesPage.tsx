import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { bookService } from '../services/bookService';
import { studentService } from '../services/studentService';
import { Loan, IssueBookRequest } from '../types/issue';
import { Book } from '../types/book';
import { StudentProfileRecord } from '../types/student';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { UncommittedNotice } from '../components/common/UncommittedNotice';
import { useToast } from '../components/common/Toast';
import { ApiError } from '../services/apiClient';
import {
  Repeat,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clock,
} from 'lucide-react';

const FINE_PER_DAY_RUPEES = 120;

export const IssuesPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tabs: 'active' | 'all'
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-selected student/book from URL query
  const queryStudentUserId = searchParams.get('studentUserId') || '';
  const queryBookId = searchParams.get('bookId') || '';

  // Issue Book Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentProfileRecord[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(queryStudentUserId);
  const [selectedBookId, setSelectedBookId] = useState(queryBookId);
  const [isIssuing, setIsIssuing] = useState(false);

  // Return Book Confirmation Modal
  const [returnTarget, setReturnTarget] = useState<Loan | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  const fetchLoans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await issueService.getLoans({
        activeOnly: activeTab === 'active',
        studentUserId: queryStudentUserId || undefined,
      });
      setLoans(data);
    } catch (err) {
      if (err instanceof ApiError) {
        toastError(err.message);
      } else {
        toastError('Failed to fetch book loans.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, queryStudentUserId, toastError]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // Load students & books for issue modal when opened
  useEffect(() => {
    if (isStaff && (isIssueModalOpen || queryBookId || queryStudentUserId)) {
      studentService
        .getAll()
        .then((s) => setStudents(s.filter((st) => st.user.isActive)))
        .catch(console.error);

      bookService
        .getAll()
        .then((b) => setAvailableBooks(b.filter((bk) => bk.availableCopies > 0)))
        .catch(console.error);
    }
  }, [isStaff, isIssueModalOpen, queryBookId, queryStudentUserId]);

  useEffect(() => {
    if (queryBookId || queryStudentUserId) {
      setIsIssueModalOpen(true);
      if (queryBookId) setSelectedBookId(queryBookId);
      if (queryStudentUserId) setSelectedStudentId(queryStudentUserId);
    }
  }, [queryBookId, queryStudentUserId]);

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedBookId) {
      toastError('Please select both a student and an available book.');
      return;
    }

    setIsIssuing(true);
    try {
      const payload: IssueBookRequest = {
        studentUserId: selectedStudentId,
        bookId: selectedBookId,
      };

      await issueService.issueBook(payload);
      success('Book issued successfully for 14 calendar days.');
      setIsIssueModalOpen(false);
      setSelectedBookId('');
      setSelectedStudentId('');
      setSearchParams({});
      fetchLoans();
    } catch (err) {
      if (err instanceof ApiError) {
        toastError(err.message);
      } else {
        toastError('Failed to issue book.');
      }
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReturnBook = async () => {
    if (!returnTarget) return;

    setIsReturning(true);
    try {
      const updated = await issueService.returnBook(returnTarget.id);
      const fine = updated.fineAmount;
      success(
        fine > 0
          ? `Book returned successfully. Fine settled: ₹${fine}.`
          : 'Book returned on time with ₹0 fine.'
      );
      setReturnTarget(null);
      fetchLoans();
    } catch (err) {
      if (err instanceof ApiError) {
        toastError(err.message);
      } else {
        toastError('Failed to record book return.');
      }
    } finally {
      setIsReturning(false);
    }
  };

  const calculateDaysRemaining = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredLoans = loans.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.book.title.toLowerCase().includes(q) ||
      l.book.isbn.toLowerCase().includes(q) ||
      l.student.fullName.toLowerCase().includes(q) ||
      l.student.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Repeat className="w-6 h-6 text-brand-400" />
            {isStaff ? 'Circulation Desk: Issues & Returns' : 'My Borrowed Books & Fines'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isStaff
              ? 'Issue books to students (14-day loan), process returns, and settle overdue fines'
              : 'Track your borrowed books, due dates, and fine calculations'}
          </p>
        </div>

        {isStaff && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsIssueModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Issue Book
          </Button>
        )}
      </div>

      <UncommittedNotice
        featureName="Circulation & Fine Engine (Phase 3)"
        endpoints={['/api/issues', '/api/issues/:loanId/return']}
      />

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Loans
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All History
          </button>
        </div>

        {/* Search */}
        <div className="sm:w-72">
          <Input
            placeholder="Search book title, ISBN, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullHeight label="Loading loan records..." />
      ) : filteredLoans.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title={activeTab === 'active' ? 'No active loans' : 'No loan history'}
          description={
            activeTab === 'active'
              ? 'There are currently no active books checked out from the library.'
              : 'No borrowing records exist matching your query.'
          }
          actionLabel={isStaff ? 'Issue a Book' : undefined}
          onAction={() => setIsIssueModalOpen(true)}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Book</th>
                  <th className="px-5 py-3.5">Borrower</th>
                  <th className="px-5 py-3.5">Issued On</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Status & Fine</th>
                  {isStaff && <th className="px-5 py-3.5 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLoans.map((loan) => {
                  const isReturned = !!loan.returnedAt;
                  const daysRemaining = calculateDaysRemaining(loan.dueDate);
                  const isOverdue = !isReturned && daysRemaining < 0;
                  const calculatedOverdueFine = isOverdue
                    ? Math.abs(daysRemaining) * FINE_PER_DAY_RUPEES
                    : 0;

                  return (
                    <tr key={loan.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                          <span>{loan.book.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ISBN: {loan.book.isbn} &bull; {loan.book.author}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-200">{loan.student.fullName}</div>
                        <div className="text-[11px] text-slate-400">{loan.student.email}</div>
                      </td>

                      <td className="px-5 py-3.5 text-slate-300">
                        {new Date(loan.issuedAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className={isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {isReturned ? (
                          <div className="flex items-center gap-1.5">
                            <Badge variant="success" size="sm">
                              Returned on {new Date(loan.returnedAt!).toLocaleDateString()}
                            </Badge>
                            {loan.fineAmount > 0 && (
                              <Badge variant="warning" size="sm">
                                Fine: ₹{loan.fineAmount}
                              </Badge>
                            )}
                          </div>
                        ) : isOverdue ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge variant="danger" size="sm">
                              Overdue ({Math.abs(daysRemaining)}d)
                            </Badge>
                            <span className="text-[11px] text-rose-400 font-semibold">
                              Est. Fine: ₹{calculatedOverdueFine}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="brand" size="sm">
                            {daysRemaining === 0 ? 'Due Today' : `${daysRemaining} days left`}
                          </Badge>
                        )}
                      </td>

                      {isStaff && (
                        <td className="px-5 py-3.5 text-right">
                          {!isReturned ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setReturnTarget(loan)}
                              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            >
                              Return Book
                            </Button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">Completed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSearchParams({});
        }}
        title="Issue Book to Student"
        subtitle="Enforces 14-calendar-day loan period and max 3 active loans"
        maxWidth="lg"
      >
        <form onSubmit={handleIssueBook} className="space-y-4">
          <Select
            label="Select Enrolled Student"
            required
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            placeholder="-- Choose active student --"
            options={students.map((st) => ({
              value: st.userId,
              label: `${st.user.fullName} (${st.enrollmentNo} - ${st.department})`,
            }))}
          />

          <Select
            label="Select Available Book"
            required
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            placeholder="-- Choose book with available copies --"
            options={availableBooks.map((b) => ({
              value: b.id,
              label: `${b.title} by ${b.author} (${b.availableCopies} available)`,
            }))}
          />

          {/* Info pill about loan policy */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-brand-300 font-semibold">
              <Clock className="w-4 h-4" />
              <span>Standard Loan Policy</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
              <li>Loan Period: 14 calendar days from today.</li>
              <li>Limit: Maximum 3 active loans per student.</li>
              <li>Students with overdue books cannot borrow new books.</li>
              <li>Fine: ₹120 per overdue calendar day upon return.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsIssueModalOpen(false);
                setSearchParams({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isIssuing}>
              Confirm Issue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Return Book Confirmation Modal */}
      {returnTarget && (
        <Modal
          isOpen={!!returnTarget}
          onClose={() => setReturnTarget(null)}
          title="Process Book Return"
          subtitle="Record return date and settle fine calculation"
          maxWidth="md"
        >
          {(() => {
            const daysRemaining = calculateDaysRemaining(returnTarget.dueDate);
            const isOverdue = daysRemaining < 0;
            const overdueDays = isOverdue ? Math.abs(daysRemaining) : 0;
            const estimatedFine = overdueDays * FINE_PER_DAY_RUPEES;

            return (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Book:</span>
                    <span className="font-semibold text-slate-100">{returnTarget.book.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <span className="text-slate-200">{returnTarget.student.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Due Date:</span>
                    <span className={isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                      {new Date(returnTarget.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Fine calculation display */}
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    isOverdue
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    {isOverdue ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{isOverdue ? 'Overdue Return Detected' : 'On-Time Return'}</span>
                  </div>
                  {isOverdue ? (
                    <p className="text-[11px] leading-relaxed">
                      This book is overdue by <span className="font-bold">{overdueDays} calendar day(s)</span>.
                      At ₹120/day, the calculated fine is{' '}
                      <span className="font-bold text-white text-sm">₹{estimatedFine}</span>.
                    </p>
                  ) : (
                    <p className="text-[11px]">
                      Book is returned within the 14-day loan window. No overdue fine is charged (₹0).
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReturnTarget(null)}
                    disabled={isReturning}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleReturnBook}
                    isLoading={isReturning}
                  >
                    Confirm Return & Settle
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
