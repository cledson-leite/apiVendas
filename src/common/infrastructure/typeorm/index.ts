import { DataSource } from 'typeorm'
import { env } from '../env/validation'

const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  schema: env.DB_SCHEMA,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  synchronize: false,
  logging: false,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
  ssl: true,
})

export default dataSource

// yarn typeorm:dev -- -d ./src/common/infrastructure/typeorm/index.ts migration:run
