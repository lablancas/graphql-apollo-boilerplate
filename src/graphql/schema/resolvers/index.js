import fs from 'fs'
import path from 'path'
import { camelCase, startCase } from 'lodash'
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLURL, GraphQLEmail } from 'graphql-custom-types'

const resolvers = {
  Query: {},
  Mutation: {},
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
  JSON: GraphQLJSON,
  URL: GraphQLURL,
  Email: GraphQLEmail,
}

const directories = ['query', 'mutation']
directories.forEach(dir => {
  const key = startCase(dir)
  fs.readdirSync(path.join(__dirname, `./${dir}`)).forEach(filename => {
    resolvers[key][camelCase(filename.replace(/\.js$/, ''))] = require(`./${dir}/${filename}`).default
  })
})

export default resolvers
