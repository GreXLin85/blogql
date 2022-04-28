import { Comment as CommentType, initModels } from '../../models';
const { Post, Comment } = initModels();

import { AuthenticationError, ApolloError } from 'apollo-server-express';
import getFields from '../utils/getFields';

export default {
    Mutation: {
        async createComment(_: any, { text, postId, createdBy }: any, { user = null }: any) {
            if (!user) {
                throw new AuthenticationError('You must login to create a comment');
            }
            if (!createdBy) {
                createdBy = user.id;
            }

            const post = await Post.findByPk(postId);

            if (post) {
                return await post.createComment({ text, createdBy });
            }
            throw new ApolloError('Unable to create a comment');
        },
        async updateComment(_: any, { id, data }: any, { user = null }: any) {
            if (!user) {
                throw new AuthenticationError('You must login to update a comment');
            }
            const comment = await Comment.findByPk(id);
            if (comment) {
                if (comment.createdBy === user.id) {
                    return await comment.update(data);
                }
                throw new ApolloError('You are not allowed to update this comment');
            }
            throw new ApolloError('Unable to update a comment');
        },
        async deleteComment(_: any, { id }: any, { user = null }: any) {
            if (!user) {
                throw new AuthenticationError('You must login to delete a comment');
            }

            const comment = await Comment.findByPk(id);
            if (comment) {
                if (comment.createdBy === user.id) {
                    try {
                        await comment.destroy();

                        return id;
                    } catch {
                        throw new ApolloError('Unable to delete a comment');
                    }
                }
                throw new ApolloError('You are not allowed to delete this comment');
            }
            throw new ApolloError('Unable to delete a comment');
        }

    },
    Query: {
        async comments(post: any, { first, after }: any, { user = null }: any, info: any) {
            return await Comment.findAll({
                limit: first,
                offset: after,
                attributes: getFields(info)
            });
        },
        async comment(root: any, { id }: any, { user = null }: any, info: any) {
            return await Comment.findByPk(id, {
                attributes: getFields(info)
            });
        }
    },
    Comment: {
        async createdBy(comment: CommentType, _: any, { user = null }: any, info: any) {
            return await comment.getUser({
                attributes: getFields(info),
            });
        },
        async postId(comment: CommentType, _: any, { user = null }: any, info: any) {
            return await comment.getPost({
                attributes: getFields(info)
            });
        }
    }
};