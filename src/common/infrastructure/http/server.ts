import { env } from '../env/validation'
import app from './app'

app.listen(env.PORT, () => {
  console.log(`Server started on port ${env.PORT}!`)
  console.log(`Api docs available at ${env.API_URL}/docs`)
})
