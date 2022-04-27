import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

import { initModels, User as UserType } from '../../models';
const { User } = initModels();

export default {
  Mutation: {
    /* For Auth */

    async register(root: any, args: any, { user = null }: any) {
      if (user) {
        throw new ForbiddenError('You are already logged in');
      }
      const { username, password } = args;
      return await User.create({ username, password });
    },

    async login(root: any, args: any, { user = null }: any) {
      if (user) {
        throw new ForbiddenError('You are already logged in');
      }
      const { username, password } = args;


      const userData = await User.findOne({ where: { username }, include: { all: true } });

      if (userData && compareSync(password, userData.password)) {
        return { user: userData.toJSON(), token: sign({ id: userData.id }, 'mySecret') };
      }
      throw new AuthenticationError('Invalid credentials');
    },

    /* For Mutations*/

    async createUser(root: any, args: any, { user = null }: any) {
      if (!user) {
        throw new ForbiddenError('You must be logged in');
      }
      const { username, password } = args;
      return await User.create({ username, password });
    },

    async updateUser(root: any, args: any, { user = null }: any) {
      if (!user) {
        throw new ForbiddenError('You must be logged in');
      }
      let { id } = args;

      if (!id) {
        id = user.id;
      }

      let updatedUser = await User.update(args.data, { where: { id } });


      if (updatedUser) {
        return await User.noCache().findByPk(id);
      }
      throw new Error('User not found');

    },

    async deleteUser(root: any, args: any, { user = null }: any) {
      if (!user) {
        throw new ForbiddenError('You must be logged in');
      }
      const { id } = args;

      let destroyedUser = await User.destroy({ where: { id } });

      if (destroyedUser) {
        return destroyedUser;
      }
      throw new Error('User not found');
    }


  },
  Query: {
    async users() {
      return await User.findAll();
    },
    async user(root: any, { id }: any) {
      return await User.findByPk(id);
    },
  },
  User: {
    async posts(user: UserType) {
      return await user.getPosts();
    },
    async comments(user: UserType) {
      return await user.getComments();
    }
  }
};
