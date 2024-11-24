import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-momery.repository'
import { ProductModel } from '@/products/domain/models/product.model'
import {
  IProductRepository,
  ProductId,
} from '@/products/domain/repositories/product.repository'

export class ProductsInMemoryRepository
  extends InMemoryRepository<ProductModel>
  implements IProductRepository
{
  sortableFields: string[] = ['name', 'created_at']

  async findByName(name: string): Promise<ProductModel> {
    const product = this.items.find(item => item.name === name)
    if (!product) {
      throw new NotFoundError(`Product not found with name: ${name}`)
    }
    return product
  }
  async findByAllIds(ids: ProductId[]): Promise<ProductModel[]> {
    const findedProducts = []
    for (const id of ids) {
      const product = this.items.find(item => item.id === id.id)
      if (product) {
        findedProducts.push(product)
      }
    }
    return findedProducts
  }
  async conflictName(name: string): Promise<void> {
    const product = this.items.find(item => item.name === name)
    if (product) {
      throw new ConflictError(`Alright product with name: ${name}`)
    }
  }
  protected async applyFilter(
    items: ProductModel[],
    filter: string | null,
  ): Promise<ProductModel[]> {
    if (!filter) return items
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: ProductModel[],
    sort: string,
    sortDir: 'asc' | 'desc',
  ): Promise<ProductModel[]> {
    return super.applySort(items, sort ?? 'created_at', sortDir ?? 'desc')
  }
}
