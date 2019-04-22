# TODO Apollo Server

Example server for a meeting based on https://www.apollographql.com/docs/apollo-server/getting-started in order to run the server, just doqnload the code and type: 

```
npm install
node index.js
```

The aim of this repository is to provide an overview for GraphQL basis. It you want to learn more, deeper or follow more official tutorials, I strongly recommend you to follow: https://www.howtographql.com/

## First exercise: A query

> Solution in branch: `0_init`

Install the server and run it locally. After that, open the URL: that appears in your console http://localhost:4000 and execute the query to get all todos:

```
query{
  todos{
    id
    title
    author
    description
  }
}
```

Note that you could get only title: 

```
query{
  todos{
    title
  }
}
```

## Second exercise: Mutations

Mutations are the updates throw the graph, so we will use it to create, update and delete the objects.

### Add a todo

> Solution in branch: `2_mutation`, Tip in branch: `1_mutation_tip`

Implement a mutation to add a new todo to the todo list:

```
mutation{
  addTodo(title: "Add a mutation", author:"alediator"){
    title
    author
  }
}
```

You can use the query we had in the previous exercise.

Test it in your playground http://localhost:4000:

```
mutation{
  addTodo(title:"Complete addTodo", author:"yourUser", description: "It was easy"){
    id
    title
    author
    description
  }
}
```

### Update a todo

> Solution in branch: `3_mutation_update`

Implement an update to allow us to update the todos:

```
mutation{
  updateTodo(id:1, description: "Changed description"){
    id
    title
    description
  }
}
```

Test it in your playground http://localhost:4000:

```
mutation{
  updateTodo(id:1, author: "yourUser"){
    id
    title
    author
  }
}
```

## Third exercise: Subscriptions

In addition to fetching data using queries and modifying data using mutations, the GraphQL spec supports a third operation type, called `subscription`.

This kind of operations are frequently used to notify the client about some events, like updates in any object.

### Prepare the subscription: todo's comments

> Solution in branch: `4_comments`

We will need to extend a bit the API adding a new type: `Comment`:

```
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
```

Note that once you add it to the `Todo` type, you are able to get it throw the `getTodo` or `todos` methods:

```
query{
  getTodo(id:1){
    id
    title
    author
    description
    comments{
      id
      title
      author
      description
    }
  }
}	
```

In addition, you should add the create and update mutations:

```
    # Add a comment to an existing todo
    addComment(todoId: ID!, title: String, author: String, description: String): Todo!

    # Update an existing comment
    updateComment(todoId: ID!, id: ID!, title: String, author: String, description: String): Todo!
```

Test it in your playground http://localhost:4000:

```
mutation{
  updateComment(todoId: 1, id: 300, author: "yourUser"){
    title
    comments{
      id
      title
      author
    }
  }
}
```

### Subscribe to Todo's updates

> Solution in branch `5_subscriptions`.

Based on [apollographql/graphql-subscriptions|https://github.com/apollographql/graphql-subscriptions], implement a method to be subscribed to any modification on a todo:

```
  type Subscription {
      # Subscribe to all modifications in a todo
      todoUpdated(id: ID!): Todo
  }
```

You will need to create a topic for the updates for instance, using this constant:

```
 const TODO_CHANGED_TOPIC_PREFIX = "TODO_";
```

You will need to add: 

```
    await pubsub.publish(TODO_CHANGED_TOPIC_PREFIX + todo.id, {
        todoUpdated: todo
    });
```

On each method that updates the `Todo`.

Test it in your playground http://localhost:4000:

```
subscription{
  todoUpdated(id: 1){
    id
    title
    author
    description
    comments{
      title
      author
      description
    }
  }
}
```

Then open another browser with the playground and update the `Todo`

```
mutation{
  updateTodo(id:1, author: "yourUser"){
    id
    title
    author
  }
}
```

You should had seen the update in the subscription console.