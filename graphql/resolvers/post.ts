import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { Context } from '../context'
import { POST_CREATION, POST_DELETION, POST_UPDATE } from '../types/post'
import { Post as PostType, initModels } from '../../models'
import getFields from '../utils/getFields'
import pubSub from '../utils/pubSub'
const { Post } = initModels()

export default {
  Mutation: {
    async createPost (root: any, { title, description, createdBy }: any, context: Context) {
      const { user } = (await context.verifyToken())

      if (!user) {
        throw new AuthenticationError('You must login to create a post')
      }
      if (!createdBy) {
        createdBy = user.id
      }

      const postCreation = await Post.create({
        title,
        description,
        createdBy
      })

      pubSub.publish(POST_CREATION, { postCreation })

      return postCreation
    },
    async updatePost (root: any, { id, data }: any, context: Context) {
      const { user } = (await context.verifyToken())
      if (!user) {
        throw new AuthenticationError('You must login to update a post')
      }

      const post = await Post.findByPk(id)
      if (post) {
        if (post.createdBy === user.id) {
          try {
            const postUpdate = await post.update(data)

            pubSub.publish(POST_UPDATE, { postUpdate })

            return postUpdate
          } catch (error) {
            throw new ApolloError('Unable to update a post')
          }
        }
        throw new ForbiddenError('You are not allowed to update this post')
      }
      throw new ForbiddenError('Unable to update a post')
    },
    async deletePost (root: any, { id }: any, context: Context) {
      const { user } = (await context.verifyToken())
      if (!user) {
        throw new AuthenticationError('You must login to delete a post')
      }

      const post = await Post.findByPk(id)
      if (post) {
        if (post.createdBy === user.id) {
          try {
            await post.destroy()

            pubSub.publish(POST_DELETION, { postDeletion: { id } })

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
    async posts (_: any, { first = null, after = null }: any, context: any, info: any) {
      return await Post.findAll({
        limit: first,
        offset: after,
        attributes: [...getFields(info), 'createdBy']
      })
    },
    async post (root: any, { id }: any, ctx: any, info: any) {
      return await Post.findByPk(id, {
        attributes: [...getFields(info), 'createdBy']
      })
    }
  },

  Post: {
    async createdBy (post: PostType, args: any, context: any, info: any) {
      return await post.getUser({
        attributes: getFields(info)
      })
    },
    async comments (post: PostType, args: any, context: any, info: any) {
      return await post.getComments({
        attributes: [...getFields(info), 'postId', 'createdBy']
      })
    }
  },
  Subscription: {
    postCreation: {
      subscribe: () => pubSub.asyncIterator(POST_CREATION)
    },
    postUpdate: {
      subscribe: () => pubSub.asyncIterator(POST_UPDATE)
    },
    postDeletion: {
      subscribe: () => pubSub.asyncIterator(POST_DELETION)
    }
  }
}
