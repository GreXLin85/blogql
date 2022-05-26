import { Comment as CommentType, initModels } from '../../models'

import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { COMMENT_CREATION, COMMENT_DELETION, COMMENT_UPDATE } from '../types/comment'
import { Context } from '../context'
import getFields from '../utils/getFields'
import pubSub from '../utils/pubSub'
const { Post, Comment } = initModels()

export default {
  Mutation: {
    async createComment (_: any, { text, postId, createdBy }: any, context: Context) {
      const { user } = (await context.verifyToken())
      if (!user) {
        throw new AuthenticationError('You must login to create a comment')
      }
      if (!createdBy) {
        createdBy = user.id
      }

      const post = await Post.findByPk(postId)

      if (post) {
        return await post.createComment({ text, createdBy })
      }
      throw new ApolloError('Unable to create a comment')
    },
    async updateComment (_: any, { id, data }: any, context: Context) {
      const { user } = (await context.verifyToken())
      if (!user) {
        throw new AuthenticationError('You must login to update a comment')
      }
      const comment = await Comment.findByPk(id)
      if (comment) {
        if (comment.createdBy === user.id) {
          return await comment.update(data)
        }
        throw new ApolloError('You are not allowed to update this comment')
      }
      throw new ApolloError('Unable to update a comment')
    },
    async deleteComment (_: any, { id }: any, context: Context) {
      const { user } = (await context.verifyToken())
      if (!user) {
        throw new AuthenticationError('You must login to delete a comment')
      }

      const comment = await Comment.findByPk(id)
      if (comment) {
        if (comment.createdBy === user.id) {
          try {
            await comment.destroy()

            return id
          } catch {
            throw new ApolloError('Unable to delete a comment')
          }
        }
        throw new ApolloError('You are not allowed to delete this comment')
      }
      throw new ApolloError('Unable to delete a comment')
    }

  },
  Query: {
    async comments (post: any, { first, after }: any, ctx: any, info: any) {
      return await Comment.findAll({
        limit: first,
        offset: after,
        attributes: [...getFields(info), 'postId']
      })
    },
    async comment (root: any, { id }: any, ctx: any, info: any) {
      return await Comment.findByPk(id, {
        attributes: [...getFields(info), 'postId']
      })
    }
  },
  Comment: {
    async createdBy (comment: CommentType, _: any, ctx: any, info: any) {
      return await comment.getUser({
        attributes: getFields(info)
      })
    },
    async postId (comment: CommentType, _: any, ctx: any, info: any) {
      return await comment.getPost({
        attributes: [...getFields(info), 'createdBy']
      })
    }
  },
  Subscription: {
    commentCreation: {
      subscribe: () => pubSub.asyncIterator(COMMENT_CREATION)
    },
    commentUpdate: {
      subscribe: () => pubSub.asyncIterator(COMMENT_UPDATE)
    },
    commentDeletion: {
      subscribe: () => pubSub.asyncIterator(COMMENT_DELETION)
    }
  }
}
