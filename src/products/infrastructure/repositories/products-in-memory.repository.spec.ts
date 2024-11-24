import { faker } from '@faker-js/faker/.'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import ProductDataBuilder from '../testing/helper/product.data.builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'

describe('ProductInMemoryRepository', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  describe('findByName', () => {
    it('should throw not found error if product not found', async () => {
      const name = faker.commerce.productName()
      const promise = sut.findByName(name)
      await expect(promise).rejects.toThrow(
        new NotFoundError(`Product not found with name: ${name}`),
      )
    })
    it('should finds a product by name', async () => {
      const data = ProductDataBuilder({})
      sut.items.push(data)
      const result = await sut.findByName(data.name)
      expect(result).toStrictEqual(data)
    })
  })
  describe('conflictName', () => {
    it('should throw conflict error if product founds', async () => {
      const data = ProductDataBuilder({})
      sut.items.push(data)
      const promise = sut.conflictName(data.name)
      await expect(promise).rejects.toThrow(
        new ConflictError(`Alright product with name: ${data.name}`),
      )
    })
  })
  describe('applyFilter', () => {
    it('should filter items when filter is null', async () => {
      const product = ProductDataBuilder({})
      const items = new Array(10).fill(product)
      sut.items.push(...items)
      const spyFilter = jest.spyOn(sut.items, 'filter' as any)
      const result = await sut['applyFilter'](items, null)
      expect(spyFilter).not.toHaveBeenCalled()
      expect(result).toHaveLength(items.length)
      expect(result).toStrictEqual(items)
    })
    it('should filter items using filter param', async () => {
      const items = [
        ProductDataBuilder({}),
        ProductDataBuilder({ name: 'Product' }),
        ProductDataBuilder({ name: 'PRODUCT' }),
        ProductDataBuilder({ name: 'product' }),
      ]
      sut.items.push(...items)
      const result = await sut['applyFilter'](items, 'product')
      expect(result).toHaveLength(3)
      expect(result).toStrictEqual([items[1], items[2], items[3]])
    })
  })
  describe('applySort', () => {
    it('should return list ordered by created_at desc', async () => {
      const date = new Date()
      const items = [
        ProductDataBuilder({ name: 'a', created_at: date }),
        ProductDataBuilder({
          name: 'c',
          created_at: new Date(date.getTime() + 100),
        }),
        ProductDataBuilder({
          name: 'b',
          created_at: new Date(date.getTime() - 100),
        }),
      ]
      sut.items.push(...items)
      const result = await sut['applySort'](items, null, null)
      expect(result).toStrictEqual([items[1], items[0], items[2]])
    })
  })
  it('should return list ordered by name asc', async () => {
    const items = [
      ProductDataBuilder({ name: 'a' }),
      ProductDataBuilder({ name: 'c' }),
      ProductDataBuilder({ name: 'b' }),
    ]
    sut.items.push(...items)
    const result = await sut['applySort'](items, 'name', 'asc')
    expect(result).toStrictEqual([items[0], items[2], items[1]])
  })
  it('should return list ordered by name desc', async () => {
    const items = [
      ProductDataBuilder({ name: 'a' }),
      ProductDataBuilder({ name: 'c' }),
      ProductDataBuilder({ name: 'b' }),
    ]
    sut.items.push(...items)
    const result = await sut['applySort'](items, 'name', 'desc')
    expect(result).toStrictEqual([items[1], items[2], items[0]])
  })
})
