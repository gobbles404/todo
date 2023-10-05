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

const checkmarkIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';
const redoIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96H272zM304 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128H416c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-32 0V192c0-53-43-96-96-96L304 96z"/></svg>';
function createActionButton(li, isComplete) {
  // Create a button to update the todo
  const actionButton = document.createElement("button");
  actionButton.textContent = isComplete ? "Redo" : "Complete";

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icon");
  iconDiv.innerHTML = isComplete ? redoIcon : checkmarkIcon;
  actionButton.appendChild(iconDiv);

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

const deleteIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';
function createDeleteButton(li) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icon");
  iconDiv.innerHTML = deleteIcon;
  deleteButton.appendChild(iconDiv);

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
