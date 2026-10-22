import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import { Book, CreateBookRequest, UpdateBookRequest, Category } from '../types/book';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { ApiError } from '../services/apiClient';
import { Link } from 'react-router-dom';
import {
  BookOpen, Plus, Search, Pencil, Power, Filter, ChevronRight, Sparkles,
} from 'lucide-react';

const EMPTY_FORM: CreateBookRequest = {
  isbn: '', title: '', author: '', publisher: '', publicationYear: undefined,
  shelfLocation: '', totalCopies: 1, categoryId: 0,
};

export const BooksPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCatId, setFilterCatId] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [form, setForm] = useState<CreateBookRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deactivateBook, setDeactivateBook] = useState<Book | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bks, cats] = await Promise.all([
        bookService.getAll({ search: search || undefined, categoryId: filterCatId ? Number(filterCatId) : undefined }),
        categoryService.getAll(),
      ]);
      setBooks(bks);
      setCategories(cats);
    } catch {
      toastError('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [search, filterCatId]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditBook(null); setForm(EMPTY_FORM); setFormError(''); setModalOpen(true); };
  const openEdit = (b: Book) => {
    setEditBook(b);
    setForm({
      isbn: b.isbn, title: b.title, author: b.author,
      publisher: b.publisher ?? '', publicationYear: b.publicationYear ?? undefined,
      shelfLocation: b.shelfLocation ?? '', totalCopies: b.totalCopies, categoryId: b.categoryId,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.isbn || !form.title || !form.author || !form.categoryId) {
      setFormError('ISBN, title, author and category are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (editBook) {
        const updated = await bookService.update(editBook.id, form as UpdateBookRequest);
        setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
        success('Book updated successfully');
      } else {
        const created = await bookService.create(form);
        setBooks(prev => [created, ...prev]);
        success('Book added to catalogue');
      }
      setModalOpen(false);
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateBook) return;
    setDeactivating(true);
    try {
      const updated = await bookService.deactivate(deactivateBook.id);
      setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      success('Book deactivated');
      setDeactivateBook(null);
    } catch (e) {
      toastError(e instanceof ApiError ? e.message : 'Failed to deactivate');
    } finally {
      setDeactivating(false);
    }
  };

  const field = (key: keyof CreateBookRequest, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Books</h2>
          <p className="text-sm text-slate-400 mt-0.5">{books.length} books in catalogue</p>
        </div>
        {isStaff && (
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Add Book
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search title, author, ISBN…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            id="book-search"
          />
        </div>
        <div className="w-48">
          <Select
            options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
            value={filterCatId}
            onChange={e => setFilterCatId(e.target.value)}
            id="book-category-filter"
            placeholder="All Categories"
          />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />} onClick={load}>
          Refresh
        </Button>
        <Link to="/assistant">
          <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-4 h-4 text-brand-400" />}>
            AI Assistant
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner text="Loading books…" />
      ) : books.length === 0 ? (
        <EmptyState
          title="No books found"
          description="Try adjusting your search or filters."
          icon={<BookOpen className="w-10 h-10" />}
          action={isStaff ? <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Book</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map(book => (
            <Card key={book.id} hover padding="none" className="flex flex-col overflow-hidden">
              <div className="p-4 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={book.isActive ? 'success' : 'default'} className="shrink-0">
                    {book.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-slate-500 truncate">{book.isbn}</span>
                </div>
                <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{book.title}</h3>
                <p className="text-xs text-slate-400">{book.author}</p>
                {book.category && (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-xs border border-brand-500/20">
                    {book.category.name}
                  </span>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{book.availableCopies}/{book.totalCopies} available</span>
                  {book.shelfLocation && <span>📍 {book.shelfLocation}</span>}
                </div>
              </div>
              <div className="border-t border-slate-700/50 px-4 py-2.5 flex items-center gap-2">
                <Link to={`/books/${book.id}`} className="flex-1">
                  <Button variant="ghost" size="xs" rightIcon={<ChevronRight className="w-3 h-3" />} className="w-full justify-between">
                    Details
                  </Button>
                </Link>
                {isStaff && (
                  <>
                    <Button variant="ghost" size="xs" onClick={() => openEdit(book)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>
                      Edit
                    </Button>
                    {book.isActive && (
                      <Button variant="ghost" size="xs" onClick={() => setDeactivateBook(book)} leftIcon={<Power className="w-3.5 h-3.5" />} className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                        Deactivate
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBook ? 'Edit Book' : 'Add New Book'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              {editBook ? 'Save Changes' : 'Add Book'}
            </Button>
          </>
        }
      >
        {formError && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-3 py-2 text-sm text-rose-400">{formError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="ISBN *" id="book-isbn" value={form.isbn} onChange={e => field('isbn', e.target.value)} placeholder="978-3-16-148410-0" />
          <Input label="Title *" id="book-title" value={form.title} onChange={e => field('title', e.target.value)} placeholder="Book title" />
          <Input label="Author *" id="book-author" value={form.author} onChange={e => field('author', e.target.value)} placeholder="Author name" />
          <Input label="Publisher" id="book-publisher" value={form.publisher ?? ''} onChange={e => field('publisher', e.target.value)} placeholder="Publisher name" />
          <Input label="Publication Year" id="book-year" type="number" value={form.publicationYear ?? ''} onChange={e => field('publicationYear', Number(e.target.value))} placeholder="2024" />
          <Input label="Shelf Location" id="book-shelf" value={form.shelfLocation ?? ''} onChange={e => field('shelfLocation', e.target.value)} placeholder="A-12" />
          <Input label="Total Copies" id="book-copies" type="number" min={1} value={form.totalCopies} onChange={e => field('totalCopies', Number(e.target.value))} />
          <Select
            label="Category *"
            id="book-category"
            value={form.categoryId || ''}
            onChange={e => field('categoryId', Number(e.target.value))}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            placeholder="Select category"
          />
        </div>
      </Modal>

      {/* Deactivate Confirm */}
      <ConfirmDialog
        isOpen={!!deactivateBook}
        onClose={() => setDeactivateBook(null)}
        onConfirm={handleDeactivate}
        title={`Deactivate "${deactivateBook?.title}"?`}
        description="This will mark the book as inactive and hide it from the catalogue."
        confirmLabel="Deactivate"
        danger
        loading={deactivating}
      />
    </div>
  );
};
