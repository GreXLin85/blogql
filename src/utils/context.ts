import { Context } from '../types/context.interface'
import { Request } from 'express'
import verify from './token/verify'

export default ({ req }: { req: Request }): Context => ({
  verifyToken: verify({ req })
})
