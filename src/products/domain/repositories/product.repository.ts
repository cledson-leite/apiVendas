import { IRepository } from '@/common/domain/repositories/repositoy.interface'
import { ProductModel } from '../models/product.model'

export type ProductId = {
  id: string
}

export type ProductProps = {
  name: string
  price: number
  quantity: number
}

export interface IProductRepository
  extends IRepository<ProductModel, ProductProps> {
  findByName(name: string): Promise<ProductModel>
  findByAllIds(ids: ProductId[]): Promise<ProductModel[]>
  conflictName(name: string): Promise<void>
}
