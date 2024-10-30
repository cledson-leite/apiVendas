export type SearchInput = {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: 'asc' | 'desc'
  filter?: string
}

export type SearchOutput<Model> = {
  items: Model[]
  total: number
  current_page: number
  per_page: number
  sort: string | null
  sort_dir: 'asc' | 'desc'
  filter: string | null
}

export interface IRepository<Model, Props> {
  create(props: Props): Model
  insert(model: Model): Promise<Model>
  findById(id: string): Promise<Model>
  update(model: Model): Promise<Model>
  delete(id: string): Promise<void>
  search(props: SearchInput): Promise<SearchOutput<Model>>
}
