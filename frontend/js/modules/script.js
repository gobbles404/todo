// query backend for existing todos
window.onload = () => {
    fetchTodos();
};

// JS STUFF
document.getElementById('create-todo-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const todoInput = document.getElementById('todo-input');  // Get the input element

  // ask Muhib about why localhost works and 127.0.0.1 returns CORS error
  fetch(`http://localhost:3001/create`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title: todoInput.value,
      }),
  })
  .then(response => {
    if (!response.ok) {
        return response.json().then(error => Promise.reject(error));
    }
    return response.json();
  })
  .then(data => {
    console.log('Success adding', data.title, 'to db');
    createTodo(data);
    resetInput(todoInput);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});

function createTodo(todo) {
    // todo: organize flow less random ternary operators
    // Create a new item in frontend
    console.log('Adding open todo to frontend:', todo.title);
    const li = document.createElement('li');

    li.dataset.id = todo._id;

    // Create a span to hold the todo title
    const span = document.createElement('span');
    span.textContent = todo.title;
    span.style.textDecoration = todo.completed ? 'line-through' : 'none';

    // Create a button to mark the todo
    const actionButton = document.createElement('button');
    actionButton.textContent = todo.completed ? 'Redo' : 'Complete';
    actionButton.addEventListener('click', function() {
        isComplete = todo.completed ? false : true;
        updateTodo(li.dataset.id, isComplete);
    });

    // Create a button to delete the todo
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        // Logic to delete the todo
        deleteTodo(li.dataset.id);
    });

    // Append the span and buttons to the list item
    li.appendChild(span);
    li.appendChild(actionButton);
    li.appendChild(deleteButton);

    // Append the list item to the appropriate todo list
    targetElement = todo.completed ? 'completed-list' : 'todo-list';
    document.getElementById(targetElement).appendChild(li);
}

// HELPER FUNCTIONS
function resetInput(inputElement) {
    console.log('Clearing todo input element');
    inputElement.placeholder = "ex: feed cat";
    inputElement.value = '';
}


// ENDPOINT STUFF
function updateTodo(todoId, markComplete) {
    fetch(`http://localhost:3001/todo/${todoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            completed: markComplete,
        }),
    })
    .then(response => response.json())
    .then(updatedTask => {
        const li = document.querySelector(`[data-id="${todoId}"]`);
        const span = li.firstChild;
        span.style.textDecoration = markComplete ? 'line-through' : 'none';
    })
    .catch(error => console.error('Error:', error));
}

function deleteTodo(todoId) {
    fetch(`http://localhost:3001/todo/${todoId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    })
    .then(deletedTask => {
        const li = document.querySelector(`[data-id="${todoId}"]`);
        li.remove();
    })
    .catch(error => console.error('Error:', error));
}

function fetchTodos() {
    // fetch all items in db
    fetch(`http://localhost:3001/todos`)
    .then(response => response.json())
    .then(todos => {
        todos.forEach(todo => {
            createTodo(todo);
        });
    })
    .catch(error => console.error('Error:', error));
}

