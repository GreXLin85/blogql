import { gql } from 'apollo-server-express'

export default gql`
  type Post {
    id: ID!
    title: String!
    description: String!
    createdBy: User!
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    posts(first: Int, after: Int): [Post]
    post(id: ID!): Post
  }

  input PostUpdate {
    title: String
    description: String
    createdBy: ID
  }

  extend type Mutation {
    createPost(title: String!, description: String!, createdBy: ID): Post
    updatePost(id: ID!, data: PostUpdate!): Post
    deletePost(id: ID!): ID
  }
`
