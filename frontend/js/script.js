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
    // Create a new item in frontend
    console.log('Adding open todo to frontend:', todo.title);
    
    // Create list item to append to ul
    const li = document.createElement('li');
    li.dataset.id = todo._id;

    // Create a span to hold the todo title
    const span = document.createElement('span');
    span.textContent = todo.title;
    span.style.textDecoration = todo.completed ? 'line-through' : 'none';

    let isComplete = todo.completed;

    // Create a button to mark the todo
    let actionButton = createActionButton(li, isComplete);

    // Create a button to delete the todo
    let deleteButton = createDeleteButton(li);

    // this feels like a great example of what I mean by 
    // having spent a lot of time with procedural programming
    // I know this isn't good but I don't know what this (should) look like
    return appendTodo(li, span, actionButton, deleteButton, isComplete);
}

// HELPER FUNCTIONS
function resetInput(inputElement) {
    console.log('Clearing todo input element');
    inputElement.placeholder = "ex: feed cat";
    inputElement.value = '';
}

function createActionButton(li, isComplete) {
    // Create a button to mark the todo
    const actionButton = document.createElement('button');
    actionButton.textContent = isComplete ? 'Redo' : 'Complete';
    actionButton.addEventListener('click', function() {
        isComplete = isComplete ? false : true;
        updateTodo(li.dataset.id, isComplete);
        actionButton.textContent = isComplete ? 'Redo' : 'Complete';
    });
    return actionButton;
}

function createDeleteButton(li) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        // Logic to delete the todo
        deleteTodo(li.dataset.id);
    });
    return deleteButton;
}

function appendTodo(li, span, actionButton, deleteButton, isComplete) {
    li.appendChild(span);
    li.appendChild(actionButton);
    li.appendChild(deleteButton);

    targetElement = isComplete ? 'completed-list' : 'todo-list';
    return document.getElementById(targetElement).appendChild(li);
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

