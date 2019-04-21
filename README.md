# TODO Apollo Server

Example server for a meeting based on https://www.apollographql.com/docs/apollo-server/getting-started in order to run the server, just doqnload the code and type: 

```
npm install
node index.js
```

## First exercise

Branch: `0_init`

Install the server and run it locally. After that, open the URL: that appears in your console http://localhost:4000 and execute the query to get all todos:

```
query{
  todos{
    title
    author
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

## Second exercise

Branches: `1_mutation_tip`, `2_mutation`

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