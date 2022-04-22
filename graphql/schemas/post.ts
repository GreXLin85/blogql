import { gql } from 'apollo-server-express';

export default gql`

 type Post {
     id: Int!
     title: String!
     description: String!
     createdBy: Int!
     created_by: User
     comments: [Comment!]
     createdAt: String
     updatedAt: String
 }

extend type Query {
    getAllPosts: [Post!]
    getSinglePost(postId: Int!): Post
}

 extend type Mutation {
     """
        Create a new post

        Requires authentication

        Args:
            title: The title of the post
            description: The description of the post
            createdBy: The id of the user creating the post (optional) (defaults to current user)
     """
     createPost(title: String!, description: String!, createdBy: Int): CreatePostResponse
 }

 type CreatePostResponse {
    id: Int!
    title: String!
    description: String!
    createdBy: Int!
    created_by: User
    createdAt: String!
    updatedAt: String!
 }

`;