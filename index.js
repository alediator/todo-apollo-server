const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
let todos = [
  {
    title: 'Create a repository for the backend',
    author: 'alediator',
  },
  {
    title: 'Create a repository for the frontend',
    author: 'alediator',
  },
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Todo" type can be used in other type declarations.
  type Todo {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    todos: [Todo]
  }

  # "Mutation" type
  type Mutation {
    addTodo(title: String, author: String): Todo!
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
      addTodo: (parent, args) => {
        const todo = args;
        console.log("New todo added: ", todo);
        todos.push(todo);
        return todo;
      },
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});