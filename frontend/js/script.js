function updateTodo(todoId, markComplete) {
  fetch(`/todo/${todoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: markComplete,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      const li = document.querySelector(`[data-id="${todoId}"]`);
      const span = li.firstChild;
      const actionButton = span.nextElementSibling.firstChild;
      const isComplete = actionButton.textContent === "Complete";
      const newActionButton = createActionButton(li, isComplete);
      actionButton.parentElement.replaceChild(newActionButton, actionButton);

      const targetListId = markComplete ? "completed-list" : "todo-list";
      const targetList = document.getElementById(targetListId);
      targetList.appendChild(li);

      /// update strike through
      span.style.textDecoration = markComplete ? "line-through" : "none";
    })
    .catch((error) => console.error("Error:", error));
}

function createActionButton(li, isComplete) {
  // Create a button to update the todo
  const actionButton = document.createElement("button");
  actionButton.textContent = isComplete ? "Redo" : "Complete";
  actionButton.addEventListener("click", () => {
    const toComplete = !isComplete;
    updateTodo(li.dataset.id, toComplete);
    actionButton.textContent = isComplete ? "Redo" : "Complete";
  });
  return actionButton;
}

function deleteTodo(todoId) {
  fetch(`/todo/${todoId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => Promise.reject(error));
      }
      return response.json();
    })
    .then(() => {
      const li = document.querySelector(`[data-id="${todoId}"]`);
      li.remove();
    })
    .catch((error) => console.error("Error:", error));
}

function createDeleteButton(li) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    // Logic to delete the todo
    deleteTodo(li.dataset.id);
  });
  return deleteButton;
}

function appendTodo(li, span, actionButton, deleteButton, targetElement) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.appendChild(actionButton);
  buttonContainer.appendChild(deleteButton);
  li.appendChild(span);
  li.appendChild(buttonContainer);
  // console.log(li)
  return document.getElementById(targetElement).appendChild(li);
}

function createTodo(todo) {
  // Create a new item in frontend
  // console.log('Adding open todo to frontend:', todo.title);

  // Create list item to append to ul
  const li = document.createElement("li");
  li.dataset.id = todo._id;

  // Create a span to hold the todo title
  const span = document.createElement("span");
  span.textContent = todo.title;
  span.style.textDecoration = todo.completed ? "line-through" : "none";

  // try not to mix notations?
  const isComplete = todo.completed;

  // Create a button to mark the todo
  const actionButton = createActionButton(li, isComplete);

  // Create a button to delete the todo
  const deleteButton = createDeleteButton(li);

  // determine the list that this will be appended to
  const targetElement = isComplete ? "completed-list" : "todo-list";

  // this feels like a great example of what I mean by
  // having spent a lot of time with procedural programming
  // I know this isn't good but I don't know what this (should) look like
  return appendTodo(li, span, actionButton, deleteButton, targetElement);
}

function fetchTodos() {
  // fetch all items in db
  fetch(`/todos`)
    .then((response) => response.json())
    .then((todos) => {
      todos.forEach((todo) => {
        createTodo(todo);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// HELPER FUNCTIONS
function resetInput(inputElement) {
  // console.log("Clearing todo input element");
  inputElement.placeholder = "ex: feed cat";
  inputElement.value = "";
}

// JS STUFF
document.getElementById("create-todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const todoInput = document.getElementById("todo-input"); // Get the input element

  // ask Muhib about why localhost works and 127.0.0.1 returns CORS error
  fetch(`/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todoInput.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => Promise.reject(error));
      }
      return response.json();
    })
    .then((data) => {
      //  console.log("Success adding", data.title, "to db");
      createTodo(data);
      resetInput(todoInput);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
      resetInput(todoInput);
    });
});

// query backend for existing todos
window.onload = () => {
  fetchTodos();
};
