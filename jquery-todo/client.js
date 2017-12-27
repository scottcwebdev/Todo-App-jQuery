jQuery(function ($) {

  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  var util = {
    todoId: function(num) {
      num = Math.floor(Math.random() * 1000000);
      return num;
    }
  }

  var App = {
    init: function(e) {
      this.todos = this.localStorage('todo');
      this.compileHandlebars = Handlebars.compile($("#main").html());
      this.render();
      this.toggleState();
      this.eventListeners();
    },
    localStorage: function(key, value) {
      if (arguments.length > 1) {
        return localStorage.setItem(key, JSON.stringify(value));
      } else {
        var getTodo = localStorage.getItem(key);
        return (getTodo && JSON.parse(getTodo) || []);
      }
    },
    eventListeners: function() {
      $('#text-box').on('keyup', this.addTodo.bind(this));
      $('#chevron').on('click', this.toggleAll.bind(this));
      $('#todos')
        .on('click', '.delete', this.delete.bind(this))
        .on('change', '.toggle', this.toggle.bind(this));
    },
    addTodo: function(e) {
      var $target = $(e.target);
      var $value = $target.val().trim();

      if (e.which !== ENTER_KEY || !$value) {
        return;
      }

      this.todos.push({
        todo: $value,
        completed: false,
        todoId: util.todoId(),
      });
      this.localStorage('todo', this.todos);
      $target.val('');
      this.render();
    },
    render: function() {
      var todo = this.todos;
      todo.length === 0 ? $('#todos').hide() : $('#todos').show() ;
      $('#todos').html(this.compileHandlebars(todo));
      this.toggleState();
    },
    delete: function(e) {
      var $target = $(e.target);
      var $indexPos = $target.closest('li').index();
      this.todos.splice($indexPos, 1);
      this.localStorage('todo', this.todos);
      this.render();
    },
    toggleState: function() {
      var todo = this.todos;

      todo.forEach(function(el, i, arr) {
        if (el.completed === true) {
          $('input').get(i + 1).checked = true;
        } else {
          $('input').get(i + 1).checked = false;
        }
      });
    },
    toggle: function(e) {
      var $target = $(e.target);
      var $indexPos = $target.closest('li').index();
      this.todos[$indexPos].completed = !this.todos[$indexPos].completed;
      this.localStorage('todo', this.todos);
      this.render();
    },
    toggleAll: function() {
      var todo = this.todos;
      var todosLength = todo.length;
      var counter = 0;

      for (var i = 0; i < todo.length; i++) {
        if (todo[i].completed === true) {
          counter++;
        }
      }

      if (counter === todosLength) {
       for (var j = 0; j < todo.length; j++) {
         this.todos[j].completed = !this.todos[j].completed;
       }
      } else {
        for (var j = 0; j < todo.length; j++) {
          this.todos[j].completed = true;
        }
      }

      this.localStorage('todo', this.todos);
      this.render();
    }
  };

  App.init();

});
