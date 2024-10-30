import { env } from '../env/validation'
import dataSource from '../typeorm'
import app from './app'

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log('Database connected')
      console.log(`Server started on port ${env.PORT}!`)
      console.log(`Api docs available at ${env.API_URL}/docs`)
    })
  })
  .catch(error => {
    console.error('Error connecting to database', error)
  })
