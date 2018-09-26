import path from 'path'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'

const typesArray = fileLoader(path.join(__dirname, './types'), { extensions: ['.graphql'] })
const typeDefs = mergeTypes(typesArray)

export default makeExecutableSchema({ typeDefs, resolvers })
