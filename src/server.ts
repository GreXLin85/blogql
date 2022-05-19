import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import context from './utils/context'
import cors from 'cors'
import express from 'express'
import resolvers from './features/resolvers'
import typeDefs from './features/schemas'

const app = express()

// NOTE - This is a temporary solution for development to allow all cross-origin requests
app.use(cors())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true
})

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql', cors: false })

  app.listen(process.env.SRV_PORT, () => {
    console.log(
      `🚀 Server ready at http://${process.env.SRV_HOST}:${process.env.SRV_PORT}/graphql`
    )
  })
})
