const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
let todos = [
  {
    id: 1,
    title: 'Create a repository for the backend',
    author: 'alediator',
    description: 'We should create a repository to save backend code.',
    comments: [
        {
            id: 100,
            title: 'Why GitHub?',
            author: 'alediator',
            description: 'Why did you selected GitHub?',
        },
        {
            id: 200,
            title: 'Reason why',
            author: 'alediator',
            description: 'Because it\'s free and well known.',
        },
    ]
  },
  {
    id: 2,
    title: 'Create a repository for the frontend',
    author: 'alediator',
    description: 'We should create a repository to save frontend code.',
  },
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Todo" type can be used in other type declarations.
  type Todo {
    id: ID!
    title: String
    author: String
    description: String
    comments: [Comment]
  }

  # Comment that references a todo entry

  type Comment {
    id: ID!
    title: String
    author: String
    description: String
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