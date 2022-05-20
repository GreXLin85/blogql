import { gql } from 'apollo-server-express'

export default gql`
scalar Date

type User {
    id: ID!
    username: String!
    password: String!
    posts: [Post]
    comments: [Comment]
    createdAt: Date
    updatedAt: Date
 }

    extend type Query {
        users: [User]
        # If ID is not provided, it will return current user
        user(id: ID): User
    }

    type Login {
        user: User
        token: String
    }

    extend type Mutation {
        createUser(username: String!, password: String!): User
        # If ID is not provided, it will use current users ID
        updateUser(id: ID, data: UserUpdate!): User
        deleteUser(id: ID!): ID
    }
    
    input UserUpdate {
        username: String, password: String
    }
    
    # Auth mutations
    extend type Mutation {
        login(username: String!, password: String!): Login
        register(username: String!, password: String!): User
    }
    

`
