import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ListQueryDto } from './list-query.dto';

/** Each module describes its list view once, with this config. */
export interface ListViewConfig {
  /** Columns searched by ?search=, written with the query alias, e.g. 's.email'. Set by developers, never by users. */
  searchFields: string[];
  /** Whitelist of columns allowed in ?sort_by= (property names). */
  sortableFields: string[];
  defaultSort: { field: string; order: 'ASC' | 'DESC' };
  /** Properties that can be filtered with an exact match, e.g. ?status=Active. */
  filterableFields?: string[];
  /** true: paginate even when ?page is missing. false: return everything unless ?page is sent. */
  paginateByDefault?: boolean;
  defaultLimit?: number;
}

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

/**
 * One reusable way to build any list view: search + filters + sorting + pagination.
 *
 *   const qb = repo.createQueryBuilder('s').where('s.is_deleted = :d', { d: false });
 *   return ListViewBuilder.from(qb, STUDENT_LIST).fromQuery(query).build();
 */
export class ListViewBuilder<T extends ObjectLiteral> {
  private page?: number;
  private limit: number;

  private constructor(
    private readonly qb: SelectQueryBuilder<T>,
    private readonly config: ListViewConfig,
  ) {
    this.limit = config.defaultLimit ?? 10;
  }

  static from<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, config: ListViewConfig) {
    return new ListViewBuilder<T>(qb, config);
  }

  /** Applies search, filters, sorting and pagination from a validated query DTO. */
  fromQuery(query: ListQueryDto) {
    return this.search(query.search)
      .filter(query)
      .sort(query.sort_by, query.sort_order)
      .paginate(query.page, query.limit);
  }

  search(term?: string): this {
    const text = term?.trim();
    if (!text || this.config.searchFields.length === 0) return this;
    const escaped = text.replace(/[\\%_]/g, '\\$&'); // treat % and _ typed by the user literally
    const clause = this.config.searchFields.map((f) => `${f} LIKE :listSearch`).join(' OR ');
    // Parentheses keep the ORs from escaping earlier conditions such as is_deleted = 0.
    this.qb.andWhere(`(${clause})`, { listSearch: `%${escaped}%` });
    return this;
  }

  filter(values: object): this {
    for (const field of this.config.filterableFields ?? []) {
      const value = (values as Record<string, unknown>)[field];
      if (value === undefined || value === null || value === '') continue;
      this.qb.andWhere(`${this.qb.alias}.${field} = :filter_${field}`, { [`filter_${field}`]: value });
    }
    return this;
  }

  sort(sortBy?: string, order?: 'ASC' | 'DESC'): this {
    const { sortableFields, defaultSort } = this.config;
    if (sortBy && !sortableFields.includes(sortBy)) {
      throw new BadRequestException(`sort_by must be one of: ${sortableFields.join(', ')}`);
    }
    const field = sortBy ?? defaultSort.field;
    const direction = order ?? (sortBy ? 'ASC' : defaultSort.order);
    this.qb.orderBy(`${this.qb.alias}.${field}`, direction);
    if (field !== 'id') this.qb.addOrderBy(`${this.qb.alias}.id`, 'DESC'); // stable order for ties
    return this;
  }

  paginate(page?: number, limit?: number): this {
    this.page = page ?? (this.config.paginateByDefault ? 1 : undefined);
    if (limit) this.limit = limit;
    return this;
  }

  async build(): Promise<ListResult<T>> {
    const total = await this.qb.getCount();
    const paged = this.page !== undefined;
    if (paged) this.qb.skip((this.page! - 1) * this.limit).take(this.limit);
    const data = await this.qb.getMany();
    return {
      data,
      meta: {
        total,
        page: this.page ?? 1,
        limit: paged ? this.limit : total,
        totalPages: paged ? Math.max(1, Math.ceil(total / this.limit)) : 1,
      },
    };
  }
}
