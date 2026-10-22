import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { Book } from '../types/book';
import { Card, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/Toast';
import { ArrowLeft, BookOpen, Building2, Calendar, Hash, MapPin, Copy, Power } from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    if (!id) return;
    bookService.getById(id)
      .then(setBook)
      .catch(() => toastError('Book not found'))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line

  const handleDeactivate = async () => {
    if (!book) return;
    setDeactivating(true);
    try {
      const updated = await bookService.deactivate(book.id);
      setBook(updated);
      success('Book deactivated');
    } catch {
      toastError('Failed to deactivate book');
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading book…" />;
  if (!book) return (
    <div className="text-center py-16 text-slate-400">
      Book not found. <Link to="/books" className="text-brand-400 hover:underline">Back to books</Link>
    </div>
  );

  const details = [
    { label: 'ISBN',            value: book.isbn,                              icon: <Hash className="w-4 h-4" /> },
    { label: 'Author',          value: book.author,                            icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Publisher',       value: book.publisher ?? '—',                  icon: <Building2 className="w-4 h-4" /> },
    { label: 'Year',            value: book.publicationYear?.toString() ?? '—',icon: <Calendar className="w-4 h-4" /> },
    { label: 'Shelf',           value: book.shelfLocation ?? '—',              icon: <MapPin className="w-4 h-4" /> },
    { label: 'Copies',          value: `${book.availableCopies} / ${book.totalCopies} available`, icon: <Copy className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/books')}>
          Back
        </Button>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{book.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{book.author}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant={book.isActive ? 'success' : 'default'}>{book.isActive ? 'Active' : 'Inactive'}</Badge>
                {book.category && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-xs border border-brand-500/20">
                    {book.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          {isStaff && book.isActive && (
            <Button variant="danger" size="sm" leftIcon={<Power className="w-4 h-4" />} onClick={handleDeactivate} loading={deactivating}>
              Deactivate
            </Button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {details.map(d => (
            <div key={d.label} className="flex items-start gap-2 p-3 rounded-xl bg-slate-700/30 border border-slate-700/40">
              <span className="text-slate-500 mt-0.5">{d.icon}</span>
              <div>
                <p className="text-xs text-slate-500">{d.label}</p>
                <p className="text-sm text-white font-medium mt-0.5">{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Availability" icon={<Copy className="w-4 h-4" />} />
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">{book.availableCopies}</p>
            <p className="text-xs text-slate-400 mt-1">Available</p>
          </div>
          <div className="h-12 w-px bg-slate-700/60" />
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{book.totalCopies}</p>
            <p className="text-xs text-slate-400 mt-1">Total</p>
          </div>
          <div className="h-12 w-px bg-slate-700/60" />
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-400">{book.totalCopies - book.availableCopies}</p>
            <p className="text-xs text-slate-400 mt-1">On Loan</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
