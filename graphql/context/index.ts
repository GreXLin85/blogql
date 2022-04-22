import { initModels } from '../../models';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const { User } = initModels();

const verifyToken = async (token: string) => {
    try {
        if (!token) return null;
        const { id }: any = jwt.verify(token, 'mySecret');
        const user = await User.findByPk(id);
        return user;
    } catch (error: any) {
        throw new AuthenticationError(error.message);
    }
};

export default async ({ req }: any) => {
    const token = (req.headers && req.headers.authorization) || '';
    const user = await verifyToken(token)
    return { user };
};