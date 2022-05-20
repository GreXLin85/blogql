import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import compression from 'compression'
import context from './graphql/context'
import cors from 'cors'
import express from 'express'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/schemas'
// Subscriptions
import { WebSocketServer } from 'ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { useServer } from 'graphql-ws/lib/use/ws'

const app = express()
app.disable('x-powered-by')

// NOTE - This is a temporary solution for development to allow all cross-origin requests
app.use(cors())

app.use(compression({
  level: 9
}))

const httpServer = createServer(app)

const schema = makeExecutableSchema({ typeDefs, resolvers })
const apolloServer = new ApolloServer({
  schema,
  context,
  introspection: true
})

apolloServer.start().then((a) => {
  apolloServer.applyMiddleware({ app, path: '/graphql', cors: false })

  const server = httpServer.listen(process.env.SRV_PORT, () => {
    console.log(`🚀 Query + Mutation Server ready at http://${process.env.SRV_HOST}:${process.env.SRV_PORT}/graphql`)

    const wsServer = new WebSocketServer({
      server,
      path: '/graphql'
    })

    useServer({
      schema
    }, wsServer)

    console.log(`🚀 Subscriptions server ready at ws://${process.env.SRV_HOST}:${process.env.SRV_PORT}/graphql`)
  })
})
