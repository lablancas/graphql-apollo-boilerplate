import { MongoClient } from 'mongodb'
import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import { ApolloEngine } from 'apollo-engine'

import schema from './graphql/schema'
import connectors from './connectors'

(async () => {
  const {
    PORT = 4000,
    ENGINE_API_KEY = 'service:lineups-graphql:uXZKwoOe01GY645PXB-l5w',
    LOG_LEVEL = 'INFO',
    MONGO_URL = 'mongodb://localhost:27017/lineups-production',
    DB_POOL_SIZE = 20,
  } = process.env

  // connect to Mongo synchronously so we can add DB connection to GraphQL server context
  const connection = await MongoClient.connect(MONGO_URL, {
    poolSize: DB_POOL_SIZE,
  })
  const mongo = connection.db(connection.s.options.dbName)
  console.log(`Connected to ${connection.s.url}`)
  console.log(`Using ${connection.s.options.dbName} database`)

  const app = express()

  const engine = new ApolloEngine({
    apiKey: ENGINE_API_KEY,
    logging: {
      level: LOG_LEVEL,
    },
  })

  app.use(compression())
  app.use(cors())

  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema,
      context: connectors(mongo),
      tracing: true,
      cacheControl: { defaultMaxAge: 300 },
    })
  )

  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
    }),
  )

  engine.listen({
    port: PORT,
    expressApp: app,
  }, () => console.log(`Listening on port ${PORT}!`))
})()
