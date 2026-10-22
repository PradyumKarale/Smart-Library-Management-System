export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string | null;
  publicationYear: number | null;
  shelfLocation: string | null;
  totalCopies: number;
  availableCopies: number;
  isActive: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  isbn: string;
  title: string;
  author: string;
  publisher?: string | null;
  publicationYear?: number | null;
  shelfLocation?: string | null;
  totalCopies?: number;
  categoryId: number;
}

export interface UpdateBookRequest {
  isbn?: string;
  title?: string;
  author?: string;
  publisher?: string | null;
  publicationYear?: number | null;
  shelfLocation?: string | null;
  totalCopies?: number;
  categoryId?: number;
}

export interface BookFilters {
  categoryId?: number;
  search?: string;
}
