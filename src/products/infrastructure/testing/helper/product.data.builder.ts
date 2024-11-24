import { ProductModel } from '@/products/domain/models/product.model'
import { faker } from '@faker-js/faker'
export default function ProductDataBuilder(
  props: Partial<ProductModel>,
): ProductModel {
  return {
    id: props.id || faker.string.uuid(),
    name: props.name || faker.commerce.productName(),
    price:
      props.price ||
      Number(faker.commerce.price({ min: 100, max: 10000, dec: 2 })),
    quantity: props.quantity || faker.number.int({ min: 1, max: 100 }),
    created_at: props.created_at || faker.date.recent(),
    updated_at: props.updated_at || faker.date.recent(),
  }
}
