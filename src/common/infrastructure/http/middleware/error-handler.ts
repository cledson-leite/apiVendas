import { AppError } from '@/common/domain/errors/app-error'
import { NextFunction, Request, Response } from 'express'

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  console.error(error)

  return res.status(500).json({ message: 'Internal server error' })
}

export default errorHandler
