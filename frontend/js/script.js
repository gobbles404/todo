console.log('js is working');

// script.js
document.getElementById('create-todo-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const todoTitle = document.getElementById('todo-input').value;
  console.log('new todo created', todoTitle);

  // ask Muhib about why localhost works and 127.0.0.1 returns cors error
  fetch('http://localhost:3001/create', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title: todoTitle,
      }),
  })
  .then(response => response.json())  // Parse the JSON from the response
  .then(data => {
      console.log('Success:', data);  // Log the data received from the server
  })
  .catch((error) => {
      console.error('Error:', error);  // Log any errors
  });
});


