import { gql } from 'apollo-server-express'

export default gql`

 type Comment {
   id: ID!
   text: String!
   createdBy: User!
   postId: Post
   createdAt: String
   updatedAt: String
 }

   extend type Query {
      comments: [Comment]
      comment(id: ID!): Comment
   }

   input CommentUpdate {
    text: String
    createdBy: ID
   }

    extend type Mutation {
      createComment(text: String!, postId: ID!, createdBy: ID): Comment
      updateComment(id: ID!, data: CommentUpdate!): Comment
      deleteComment(id: ID!): ID
    }

`
