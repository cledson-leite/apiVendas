import { ProductModel } from '@/products/domain/models/product.model'

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class ProductEntity implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ type: 'int' })
  quantity: number

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date
}
