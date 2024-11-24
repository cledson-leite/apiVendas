import { faker } from '@faker-js/faker/.'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

describe('PeroductInMemoryRepository', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  describe('findByName', () => {
    it('should throw not found error if product not found', async () => {
      const name = faker.commerce.productName()
      const promise = sut.findByName(name)
      await expect(promise).rejects.toThrow(
        new NotFoundError(`Product not found with name ${name}`),
      )
    })
  })
})
