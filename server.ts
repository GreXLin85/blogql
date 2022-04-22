import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';
import context from './graphql/context'

const app = express();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql', cors: false });

  app.listen(4000, () => {
    console.log('🚀  Server ready at http://localhost:4000/graphql');
  });
});


