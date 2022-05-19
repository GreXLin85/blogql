import { User } from '../features/models'

export interface Context {

    verifyToken: Promise<{
        user: User | null;
    }>
}
