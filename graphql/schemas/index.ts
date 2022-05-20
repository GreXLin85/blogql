import { gql } from 'apollo-server-express'
import commentType from './comment'
import postType from './post'
import userType from './user'

const rootType = gql`
 type Query {
     root: String
 }
 type Mutation {
     root: String
 }
 type Subscription {
    root: String
}

`

export default [rootType, userType, postType, commentType]
