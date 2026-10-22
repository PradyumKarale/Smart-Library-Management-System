import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { categoryService } from '../services/categoryService';
import { Category, CreateCategoryRequest } from '../types/book';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { ApiError } from '../services/apiClient';
import { Layers, Plus, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategoriesPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      if (err instanceof ApiError) {
        toastError(err.message);
      } else {
        toastError('Failed to load categories.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    if (name.trim().length < 2) {
      setNameError('Category name must be at least 2 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateCategoryRequest = {
        name: name.trim(),
        description: description.trim() || null,
      };
      await categoryService.create(payload);
      success(`Category "${payload.name}" created successfully.`);
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      if (err instanceof ApiError) {
        toastError(err.message);
      } else {
        toastError('Failed to create category.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-brand-400" />
            Book Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and organize the library's subjects, disciplines, and genres
          </p>
        </div>

        {isStaff && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Category
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullHeight label="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No categories found"
          description="No library categories have been set up yet."
          actionLabel={isStaff ? 'Create Category' : undefined}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} hover className="flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {cat.id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-100">{cat.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided for this category.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'Catalog category'}
                </span>
                <Link
                  to={`/books?categoryId=${cat.id}`}
                  className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium group"
                >
                  <span>Browse books</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Category"
        subtitle="Group library books under a common subject or department"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Distributed Systems"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError || undefined}
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of books covered in this discipline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-800 focus:border-brand-500/80 focus:ring-2 focus:ring-brand-500/20 p-3 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
