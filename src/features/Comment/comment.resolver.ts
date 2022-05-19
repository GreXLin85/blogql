import {
  ApolloError,
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express'
import { Post as PostType, initModels } from '../models'
import getFields from '../../utils/getFields'
const { Post } = initModels()

export default {
  Mutation: {
    async createPost(
      root: any,
      { title, description, createdBy }: any,
      { user = null }: any
    ) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post')
      }
      if (!createdBy) {
        createdBy = user.id
      }

      return await Post.create({
        title,
        description,
        createdBy
      })
    },
    async updatePost(root: any, { id, data }: any, { user = null }: any) {
      if (!user) {
        throw new AuthenticationError('You must login to update a post')
      }

      const post = await Post.findByPk(id)
      if (post) {
        if (post.createdBy === user.id) {
          try {
            return await post.update(data)
          } catch (error) {
            throw new ApolloError('Unable to update a post')
          }
        }
        throw new ForbiddenError('You are not allowed to update this post')
      }
      throw new ForbiddenError('Unable to update a post')
    },
    async deletePost(root: any, { id }: any, { user = null }: any) {
      if (!user) {
        throw new AuthenticationError('You must login to delete a post')
      }

      const post = await Post.findByPk(id)
      if (post) {
        if (post.createdBy === user.id) {
          try {
            await post.destroy()

            return id
          } catch (error) {
            throw new ApolloError('Unable to delete a post')
          }
        }
        throw new ForbiddenError('You are not allowed to delete this post')
      }
    }
  },
  Query: {
    async posts(_: any, { first, after }: any, context: any, info: any) {
      return await Post.findAll({
        limit: first,
        offset: after,
        attributes: getFields(info)
      })
    },
    async post(root: any, { id }: any, ctx: any, info: any) {
      return await Post.findByPk(id, {
        attributes: getFields(info)
      })
    }
  },

  Post: {
    async createdBy(post: PostType, args: any, context: any, info: any) {
      return await post.getUser({
        attributes: getFields(info)
      })
    },
    async comments(post: PostType, args: any, context: any, info: any) {
      return await post.getComments({
        attributes: getFields(info)
      })
    }
  }
}
