import { gql } from 'apollo-server-express'
import commentType from './Comment/comment.schema'
import postType from './Post/post.schema'
import userType from './User/user.schema'

const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`

export default [rootType, userType, postType, commentType]
