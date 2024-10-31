import { InMemoryRepository, ModelProps } from './in-momery.repository'
import { NotFoundError } from '../errors/not-found-error'
import { faker } from '@faker-js/faker'

type StubModelProps = {
  id: string
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date
}
class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFields = ['name', 'id', 'created_at']
  }
  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) {
      return items
    }
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemoryRepository', () => {
  let sut: InMemoryRepository<ModelProps>
  let model: StubModelProps
  let props: any

  beforeEach(() => {
    sut = new StubInMemoryRepository()
    props = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      quantity: faker.number.int({ max: 100, min: 1 }),
    }
    model = {
      id: faker.string.uuid(),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      ...props,
    }
  })

  describe('create', () => {
    it('should create a new model', () => {
      const result = sut.create(props)
      expect(result.id).toBeDefined()
      expect(result.created_at).toBeDefined()
      expect(result.updated_at).toBeDefined()
      expect(result.name).toStrictEqual(props.name)
      expect(result.price).toStrictEqual(props.price)
      expect(result.quantity).toStrictEqual(props.quantity)
    })
  })
  describe('insert', () => {
    it('should insert a new model', async () => {
      const result = await sut.insert(model)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('findById', () => {
    it('should throws error when id not found', async () => {
      const id = faker.string.uuid()
      const promise = sut.findById(id)
      await expect(promise).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${id}`),
      )
    })
    it('should find a model by id', async () => {
      await sut.insert(model)
      const result = await sut.findById(model.id)
      expect(result).toStrictEqual(model)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('update', () => {
    it('should throws error when id not found in update method', async () => {
      const promise = sut.update(model)
      await expect(promise).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${model.id}`),
      )
    })

    it('should update a model', async () => {
      const data = await sut.insert(model)
      const updatedModel = {
        id: data.id,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantity: faker.number.int({ max: 100, min: 1 }),
        created_at: data.created_at,
        updated_at: faker.date.recent(),
      }
      const result = await sut.update(updatedModel)
      expect(result.id).toStrictEqual(data.id)
      expect(result).toStrictEqual(updatedModel)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('delete', () => {
    it('should throws error when id not found in update method', async () => {
      const promise = sut.delete(model.id)
      await expect(promise).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${model.id}`),
      )
    })
    it('should delete a model', async () => {
      await sut.insert(model)
      expect(sut.items).toHaveLength(1)
      await sut.delete(model.id)
      expect(sut.items).toHaveLength(0)
    })
  })

  describe('applyFilter', () => {
    it('should no filter items when filter is null', async () => {
      const items = new Array(10).fill(model)
      const spyFilter = jest.spyOn(items, 'filter' as any)
      const result = await sut['applyFilter'](items, null)
      expect(spyFilter).not.toHaveBeenCalled()
      expect(result).toHaveLength(items.length)
      expect(result).toStrictEqual(items)
    })
    it('should filter items using filter param', async () => {
      const otherModel = {
        id: faker.string.uuid(),
        created_at: faker.date.recent(),
        updated_at: faker.date.recent(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantity: faker.number.int({ max: 100, min: 1 }),
      }
      const items = [otherModel, model]
      let result = await sut['applyFilter'](
        items,
        otherModel.name.toUpperCase(),
      )
      expect(result[0]).toStrictEqual(otherModel)
      result = await sut['applyFilter'](items, otherModel.name)
      expect(result[0]).toStrictEqual(otherModel)
    })
  })
  describe('applySort', () => {
    const primeiroModel = {
      id: 'aaaa',
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      name: 'aaaa',
      price: faker.commerce.price(),
      quantity: faker.number.int({ max: 100, min: 1 }),
    }
    const segundoModel = {
      id: 'bbbb',
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      name: 'bbbb',
      price: faker.commerce.price(),
      quantity: faker.number.int({ max: 100, min: 1 }),
    }
    const items = [segundoModel, primeiroModel]
    it('should return without ordering if it does not find the criteria in the list', async () => {
      const result = await sut['applySort'](items, 'other')
      expect(result[0]).toStrictEqual(segundoModel)
      expect(result[1]).toStrictEqual(primeiroModel)
    })
    it('should order the items by the criteria and the order passed', async () => {
      let result = await sut['applySort'](items, 'name', 'desc')
      expect(result[0]).toStrictEqual(segundoModel)
      expect(result[1]).toStrictEqual(primeiroModel)
      result = await sut['applySort'](items, 'name', 'asc')
      expect(result[0]).toStrictEqual(primeiroModel)
      expect(result[1]).toStrictEqual(segundoModel)
    })
  })
  describe('applyPaginate', () => {
    it('should paginate the method according to the criteria passed', async () => {
      const items = new Array(10).fill(model)
      let result = await sut['applyPaginate'](items, 1, 5)
      expect(result).toHaveLength(5)
      expect(result).toStrictEqual([
        items[0],
        items[1],
        items[2],
        items[3],
        items[4],
      ])
      result = await sut['applyPaginate'](items, 2, 5)
      expect(result).toHaveLength(5)
      expect(result).toStrictEqual([
        items[5],
        items[6],
        items[7],
        items[8],
        items[9],
      ])
      result = await sut['applyPaginate'](items, 2, 3)
      expect(result).toHaveLength(3)
      expect(result).toStrictEqual([items[3], items[4], items[5]])
      result = await sut['applyPaginate'](items, 4, 3)
      expect(result).toHaveLength(1)
      expect(result).toStrictEqual([items[9]])
    })
  })
  describe('seach', () => {
    it('should return an object with default pagination when no props are passed', async () => {
      const items = new Array(16).fill(model)
      sut.items = items
      const result = await sut.search({})
      expect(result.items).toHaveLength(15)
      expect(result).toStrictEqual({
        items: items.slice(0, 15),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: 'created_at',
        sort_dir: 'asc',
        filter: null,
      })
    })
    it('should return a paginated object ordered according to the criteria', async () => {
      const items = new Array(16).fill(model)
      sut.items = items
      const result = await sut.search({
        page: 2,
        per_page: 5,
        sort: 'name',
        sort_dir: 'desc',
        filter: items[0].name,
      })
      expect(result.items).toHaveLength(5)
      expect(result).toStrictEqual({
        items: items.slice(5, 10),
        total: 16,
        current_page: 2,
        per_page: 5,
        sort: 'name',
        sort_dir: 'desc',
        filter: items[0].name,
      })
    })
  })
})
