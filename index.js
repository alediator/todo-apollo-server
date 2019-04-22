 const { ApolloServer, gql } = require('apollo-server');
 const { PubSub } = require('graphql-subscriptions');
 const pubsub = new PubSub();

 let todosCurrentId = 3;
 let commentsCurrentId = 300;
 const TODO_CHANGED_TOPIC_PREFIX = "TODO_";

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

// get a todo by identifier
function getTodoById(id){
    let todo = null;
    todos.forEach(element => {
        if(element.id == id){
            todo = element;
        }
    });
    return todo;
}

// get a todo by author
function findTodoByAuthor(author){
    let foundTodos = [];
    todos.forEach(element => {
        if(element.author == author){
            foundTodos.push(element);
        }
    });
    return foundTodos;
}

// add a comment
async function addComment(args) {
    let todo = getTodoById(args.todoId);
    if(todo != null) {
        console.log("Adding a comment: ", args);
        let comment = {
            id: commentsCurrentId,
        };
        commentsCurrentId = commentsCurrentId + 100;
        Object.assign(comment, args);
        if(!todo.comments){
            todo.comments = [];
        }
        todo.comments.push(comment);
    } else {
        console.log("Todo not found: ", args.todoId);
    }
    await pubsub.publish(TODO_CHANGED_TOPIC_PREFIX + todo.id, {
        todoUpdated: todo
    });
    return todo;
}

// update a todo
async function updateTodo(args){
    let todo = getTodoById(args.id);
    if(todo != null) {
        console.log("Todo updated: ", args);
        Object.assign(todo, args);
    } else {
        console.log("Todo not found: ", args.id);
    }
    await pubsub.publish(TODO_CHANGED_TOPIC_PREFIX + todo.id, {
        todoUpdated: todo
    });
    return todo;
}

// update a comment
async function updateComment(args) {
    let todo = getTodoById(args.todoId);
    if(todo != null) {
        let comment = null;
        if(todo.comments != null) {
          todo.comments.forEach(element => {
            if(element.id == args.id){
                comment = element;
            }
          });
        }
        if(comment != null) {
            console.log("Updating a comment: ", args);
            Object.assign(comment, args);
        } else {
            console.log("Comment not found: ", args.id);
        }
    }
    await pubsub.publish(TODO_CHANGED_TOPIC_PREFIX + todo.id, {
        todoUpdated: todo
    });
    return todo;
}

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

    # get all todos in the platform
    todos: [Todo]

    # get a todo by id
    getTodo(id: ID!): Todo

    # get a todo by author
    findTodoByAuthor(author: String!): [Todo]

  }

  # "Mutation" type
  type Mutation {

    # Add a new TODO to the list
    addTodo(title: String, author: String, description: String): Todo!

    # Update an existing TODO
    updateTodo(id: ID!, title: String, author: String, description: String): Todo!

    # Add a comment to an existing todo
    addComment(todoId: ID!, title: String, author: String, description: String): Todo!

    # Update an existing comment
    updateComment(todoId: ID!, id: ID!, title: String, author: String, description: String): Todo!
  }

  type Subscription {
      # Subscribe to all modifications in a todo
      todoUpdated(id: ID!): Todo
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    todos: () => todos,
    getTodo: (parent, args) => getTodoById(args.id),
    findTodoByAuthor: (parent, args) => findTodoByAuthor(args.author),
  },
  Mutation: {
    addTodo: (parent, args) => {
      const todo = args;
      todo.id = todosCurrentId++;
      console.log("New todo added: ", todo);
      todos.push(todo);
      return todo;
    },
    updateTodo: (parent, args) => updateTodo(args),
    addComment: (parent, args) => addComment(args),
    updateComment: (parent, args) => updateComment(args),
  },
  Subscription: {
    todoUpdated: {
      subscribe: (parent, args) => pubsub.asyncIterator(TODO_CHANGED_TOPIC_PREFIX + args.id),
    },
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});