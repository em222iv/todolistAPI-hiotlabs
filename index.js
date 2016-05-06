'use strict';

const Hapi = require('hapi');

let todos = [
    {
        id:0,
        title: "do something",
        completed: false,
    },
    {
        id:1,
        title: "do something else",
        completed: false,
    },
    {
        id:2,
        title: "do something else troll",
        completed: true,
    },
    {
        id:3,
        title: "do something else troller",
        completed: false,
    }
  ]

const server = new Hapi.Server();

server.connection({
    port: 3000,
    routes: {
        cors: true
    }
});

server.route({
  method: 'GET',
   path: '/',
    handler: function(req, reply) {
    reply("Welcome ,Stranger! go to: /todos");
  }
});

server.route({
  method: 'GET',
   path: '/todos',
    handler: function(req, reply) {
    reply(todos);
  }
});

server.route({
  method: 'POST',
   path: '/add',
    config: {
    handler: function(req, reply) {
      let title = JSON.parse(req.payload).title;
      if(title === "") return reply("Title is Empty").code(400)
      let id =  getUniqueId();
      let todo = {
          id: id,
          title: JSON.parse(req.payload).title,
          completed: false
      }
      todos = [todo,
          ...todos,
      ]
      reply(todo).code(201)
    }
  }
});

//behövlig eller inte??
function getUniqueId() {
   let id = Math.floor(Math.random() * (100000 - todos.length)) + todos.length;
   let exists = todos.filter((todo) => {
     if(todo.id === id)
       return todo;
   })
   if(exists.length > 0)
     getId();
   return id;
}

server.route({
  method: 'DELETE',
  path: '/todo/delete/{id}',
  handler: function(req, reply) {
      let id = req.params.id;
      todos = todos.filter((todo) => {
          if (todo.id != id)
              return todo
      })
      reply("deleted").code(200)
    }
});

server.route({
  method: 'PUT',
   path: '/todo/toggleCompleted/{id}',
    config: {
    handler: function(req, reply) {
      let id = req.params.id;
      todos = todos.map((todo) => {
          if (todo.id == id){
                let updateTodo = Object.assign({}, todo, {
                    completed: !todo.completed
                })
                reply(updateTodo).code(200)
                return updateTodo;
              }
           return todo
        })
      }
    }
});

server.route({
  method: 'PUT',
  path: '/todos/complete',
  config: {
    handler: function(req, reply) {
      todos = todos.map(todo => {
        return Object.assign({}, todo, {
            completed: true
        })
      })
      reply("success").code(200)
    }
  }
});

server.route({
  method: 'PUT',
   path: '/todos/clear',
    config: {
    handler: function(req, reply) {
      todos = todos.map(todo => {
        return Object.assign({}, todo, {
            completed: false
        })
      })
      reply("success").code(200)
    }
  }
});

server.route({
  method: 'PUT'
, path: '/todos/order'
, config: {
    handler: function(req, reply) {
      todos = JSON.parse(req.payload).order.map(todoId => {
            return todos.filter(todo => {
                if (todo.id == todoId)
                    return todo
            })[0]
        })
      reply("success").code(200);
    }
  }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
