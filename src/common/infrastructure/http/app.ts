import express from 'express'
import cors from 'cors'
import routes from './routes'
import errorHandler from './middleware/error-handler'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vendas API',
      version: '1.0.0',
      description: 'API para gerenciamento de vendas',
    },
    servers: [],
  },
  apis: ['./src/common/infrastructure/http/routes.ts'],
}
const swaggerSpec = swaggerJSDoc(options)

const app = express()
app.use(cors())
app.use(express.json())
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.use(routes)
app.use(errorHandler)

export default app
