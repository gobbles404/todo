console.log('js is working');

// script.js
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
    console.log('Success:', data);  // Log the data received from the server
    createNewTaskItem(data);
    resetInput(todoInput);
  })
  .catch((error) => {
      console.error('Error:', error);  // Log any errors
  });
});


function resetInput(inputElement) {
    inputElement.placeholder = "ex: feed cat";
    inputElement.value = '';
}

// Define the function to create a new task item
function createNewTaskItem(task) {
    // Create a new list item
    console.log(task);
    const li = document.createElement('li');

    li.dataset.id = task._id;

    // Create a span to hold the todo title
    const span = document.createElement('span');
    span.textContent = task.title;

    // Create a button to mark the todo as complete
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', function() {
        // Logic to mark the todo as complete
        completeTodo(li.dataset.id);
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
    li.appendChild(completeButton);
    li.appendChild(deleteButton);

    // Append the list item to the todo list
    document.getElementById('todo-list').appendChild(li);
}

function completeTodo(todoId) {
    fetch(`http://localhost:3001/todo/${todoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            completed: true,
        }),
    })
    .then(response => response.json())
    .then(updatedTask => {
        const li = document.querySelector(`[data-id="${todoId}"]`);
        const span = li.firstChild;
        span.style.textDecoration = 'line-through';
        // todo: disable button or let user redo todo
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
