import { initModels } from '../../models';
const { Post } = initModels();

import { AuthenticationError, ApolloError } from 'apollo-server-express';

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
    },
    Comment: {
        async createdBy(comment: any) {
            return await comment.getUser();
        },
        async post(comment: any) {
            return await comment.getPost();
        },
    }

};