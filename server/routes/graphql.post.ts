import { ApolloServer } from "@apollo/server";
import { startServerAndCreateH3Handler } from "@as-integrations/h3";

const typeDefs = `
type Query {
    getName: String
}
`

const apollo = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            getName: () => 'zhuang'
        }
    }
})

export default startServerAndCreateH3Handler(apollo, {
    context: async (evt) => {
        return {}
    }
})