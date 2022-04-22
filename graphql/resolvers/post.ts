import { initModels } from '../../models';
const { Post } = initModels();

import { AuthenticationError } from 'apollo-server-express';

export default {
    Mutation: {
        async createPost(root: any, { title, description, createdBy }: any, { user = null }: any) {
            if (!user) {
                throw new AuthenticationError('You must login to create a post');
            }
            if (!createdBy) {
                createdBy = user.id;
            }
            let asd = await Post.create({
                title,
                description,
                createdBy,
            });



            return asd;
        },
    },
    Query: {
        getAllPosts(root: any, args: any, context: any) {
            return Post.findAll();
        },
        getSinglePost(_: any, { postId }: any, context: any) {
            return Post.findByPk(postId);
        },
    },

    Post: {
        async created_by(post: any) {

            return await post.getUser();

        },

        comments(post: any) {
            return post.getComments();
        },
    },
};