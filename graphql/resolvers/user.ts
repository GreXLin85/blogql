import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';

import { initModels } from '../../models';
const { User } = initModels();

export default {
  Mutation: {
    async register(root: any, args: any, { user = null }: any) {
      const { username, password } = args;

      if (user) {
        throw new AuthenticationError('You are already logged in');
      }
      return await User.create({ username, password });
    },

    async login(root: any, args: any, { user = null }: any) {
      const { username, password } = args;

      if (user) {
        throw new AuthenticationError('You are already logged in');
      }
      const userData = await User.findOne({ where: { username } });

      if (userData && compareSync(password, userData.password)) {
        const token = sign({ id: userData.id }, 'mySecret');
        return { ...userData.toJSON(), token };
      }
      throw new AuthenticationError('Invalid credentials');
    },
  },
  User: {
    async posts(user: any) {
      console.log("asdasd");
      

      return await user.getPosts();
    },
  }
};
