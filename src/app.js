const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { schema, driver } = require('./db');
const config = require('./config');
const routes = require('./routes');
const app = express();

const server = new ApolloServer({ schema, context: { driver } });
server.applyMiddleware({ app, path: '/query' });
routes.applyMiddleware(app);

app.listen({ port: config.port }, () =>
  console.log(`Server ready at http://localhost:${config.port}/query`)
);
