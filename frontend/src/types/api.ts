export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiValidationError[];
}
