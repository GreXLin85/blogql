import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

import { initModels, User as UserType } from '../../models';
import getFields from '../utils/getFields';
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


      const userData = await User.findOne({ where: { username } });

      if (userData && compareSync(password, userData.password)) {
        return {
          // @ts-ignore
          user: userData.toJSON(), token: sign({ id: userData.id }, process.env.JWT_SECRET, {
            algorithm: process.env.JWT_ALGORITHM,
          })
        };
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

      const userData = await User.findByPk(id);
      if (userData) {
        if (userData.id === user.id) {
          try {
            return await userData.update(args.data);
          } catch (error) {
            throw new ForbiddenError('Unable to update a user');
          }
        }
        throw new ForbiddenError('You are not allowed to update this user');
      }
      throw new ForbiddenError('Unable to update a user');
    },

    async deleteUser(root: any, args: any, { user = null }: any) {
      if (!user) {
        throw new ForbiddenError('You must be logged in');
      }
      const { id } = args;

      const userData = await User.findByPk(id);
      if (userData) {
        if (userData.id === user.id) {
          try {
            await userData.destroy();
            return id;
          } catch (error) {
            throw new ForbiddenError('Unable to delete a user');
          }
        }
        throw new ForbiddenError('You are not allowed to delete this user');
      }
    }
  },
  Query: {
    async users(_: any, { first, after }: any, context: any, info: any) {
      return await User.findAll({
        limit: first,
        offset: after,
        attributes: getFields(info)
      });
    },
    async user(root: any, { id }: any, { user = null }: any, info: any) {
      if (!id) {
        id = user.id;
      }
      return await User.findByPk(id, {
        attributes: getFields(info)
      });
    },
  },
  User: {
    async posts(user: UserType, args: any, context: any, info: any) {
      return await user.getPosts({
        attributes: getFields(info)
      });
    },
    async comments(user: UserType, args: any, context: any, info: any) {
      return await user.getComments({
        attributes: getFields(info)
      });
    }
  }
};
