import { Request } from 'express'
import { User } from '../../models'
import verify from './verify'

export interface Context {
  verifyToken: () => Promise<{
      user: User | null;
  }>
  test : () => string
}

export default ({ req }: { req: Request }): Context => ({
  verifyToken: () => verify({ req }),
  test: () => {
    return 'test'
  }
})
