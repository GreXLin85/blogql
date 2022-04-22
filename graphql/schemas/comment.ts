import { gql } from 'apollo-server-express';

export default gql`

 type Comment {
     id: Int!
     text: String!
     createdBy: User!
     post: Post!
     createdAt: String
    updatedAt: String

 }

 extend type Mutation {
     createComment(content: String!, postId: Int!, createdBy: Int!): CreateCommentResponse
 }

 type CreateCommentResponse {
    id: Int!
    text: String!
    postId: Int!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
 }

`;