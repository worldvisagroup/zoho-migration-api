export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface StandardApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
    pagination?: PaginationMeta;
  };
}

export interface StandardApiError {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: string[] | Record<string, string[]>;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}
