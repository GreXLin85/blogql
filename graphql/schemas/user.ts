import { gql } from 'apollo-server-express';

export default gql`
type User {
     id: Int
     username: String!
     password: String!
     posts: [Post]

 }

 extend type Mutation {
     register(username: String!, password: String!): RegisterResponse
     login(username: String!,password: String!): LoginResponse
 }

 type RegisterResponse {
    id: Int!
    username: String!
 }

 input RegisterInput {
     username: String!
     password: String!
 }

input LoginInput {
    username: String!
     password: String!
 }

  type LoginResponse {
    id: Int!
    username: String!
    token: String!
 }

`;