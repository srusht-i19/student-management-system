/** Shape returned by the backend's common List View Builder. */
export interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListResult<T> {
  data: T[];
  meta: ListMeta;
}

/** Query options every list endpoint accepts. */
export interface ListParams {
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}
