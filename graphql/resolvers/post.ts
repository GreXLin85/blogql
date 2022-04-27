import { initModels, Post as PostType } from '../../models';
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

            return await Post.create({
                title,
                description,
                createdBy,
            });
        },
        async updatePost(root: any, { id, data }: any, { user = null }: any) {
            if (!user) {
                throw new AuthenticationError('You must login to update a post');
            }

            let updatedPost = await Post.update(data, {
                where: { id },
            });

            if (updatedPost) {
                return await Post.noCache().findByPk(id);
            }
        },
        async deletePost(root: any, { id }: any, { user = null }: any) {
            if (!user) {
                throw new AuthenticationError('You must login to delete a post');
            }

            let deletedPost = await Post.destroy({
                where: { id },
            });

            if (deletedPost) {
                return { id };
            }
            
        }
    },
    Query: {
        async posts() {
            return await Post.findAll();
        },
        async post(root: any, { id }: any) {
            return await Post.findByPk(id);
        }
    },

    Post: {
        async createdBy(post: PostType) {
            return await post.getUser();
        },
        async comments(post: PostType) {
            return await post.getComments();
        }
    },
};