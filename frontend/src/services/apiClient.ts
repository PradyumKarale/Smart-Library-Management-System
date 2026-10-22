import { ApiResponse, ApiValidationError } from '../types/api';

export class ApiError extends Error {
  statusCode: number;
  errors?: ApiValidationError[];

  constructor(message: string, statusCode: number, errors?: ApiValidationError[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const TOKEN_KEY = 'slms_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, ...customConfig } = options;

  let url = endpoint;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers,
  });

  // Try to parse JSON response
  let json: ApiResponse<T> | null = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      // If unauthorized, notify session listener
      removeStoredToken();
      window.dispatchEvent(new Event('slms-auth-expired'));
    }

    const errorMessage = json?.message || `Request failed with status ${response.status}`;
    const validationErrors = (json as unknown as { errors?: ApiValidationError[] })?.errors;

    throw new ApiError(errorMessage, response.status, validationErrors);
  }

  // Return the data property if wrapped in standard ApiResponse envelope
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }

  return (json as unknown as T) ?? (null as unknown as T);
}

export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>) {
    return request<T>(endpoint, { method: 'GET', params });
  },

  post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};
