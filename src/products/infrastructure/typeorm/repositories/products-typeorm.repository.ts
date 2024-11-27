import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repositoy.interface'
import { ProductModel } from '@/products/domain/models/product.model'
import {
  IProductRepository,
  ProductId,
  ProductProps,
} from '@/products/domain/repositories/product.repository'
import { ILike, In, Repository } from 'typeorm'
import { ProductEntity } from '../entities/product.entity'
import dataSource from '@/common/infrastructure/typeorm'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '../../../../common/domain/errors/conflict-error'

export class ProductTypeormRepository implements IProductRepository {
  sortableFields = ['name', 'created_at']
  productRepository: Repository<ProductEntity>

  constructor() {
    this.productRepository = dataSource.getRepository(ProductEntity)
  }

  async findByName(name: string): Promise<ProductModel> {
    const product = await this.productRepository.findOneBy({ name })
    if (!product) {
      throw new NotFoundError(`Product not found with name: ${name}`)
    }
    return product
  }
  async findByAllIds(ids: ProductId[]): Promise<ProductModel[]> {
    const productIds = ids.map(id => id.id)
    return this.productRepository.find({ where: { id: In(productIds) } })
  }
  async conflictName(name: string): Promise<void> {
    const product = await this.productRepository.findOneBy({ name })
    if (product) {
      throw new ConflictError(`Alright product with name: ${name}`)
    }
  }
  create(props: ProductProps): ProductModel {
    return this.productRepository.create(props)
  }
  async insert(model: ProductModel): Promise<ProductModel> {
    return this.productRepository.save(model)
  }
  async findById(id: string): Promise<ProductModel> {
    return this._get(id)
  }
  async update(model: ProductModel): Promise<ProductModel> {
    await this._get(model.id)
    await this.productRepository.update({ id: model.id }, model)
    return model
  }
  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.productRepository.delete({ id })
  }
  async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    const valitedSort: boolean = this.sortableFields.includes(props.sort)
    const orderBy = valitedSort ? props.sort : 'created_at'
    const dirBy = props.sort_dir !== 'desc' ? 'asc' : props.sort_dir

    const [products, total] = await this.productRepository.findAndCount({
      ...(props.filter && { where: { name: ILike(props.filter) } }),
      order: { [orderBy]: dirBy },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: products,
      total,
      current_page: props.page,
      per_page: props.per_page,
      sort: orderBy,
      sort_dir: dirBy,
      filter: props.filter,
    }
  }

  private async _get(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundError(`Product not found using ID ${id}`)
    }
    return product
  }
}
