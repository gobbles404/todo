// feels like python imports
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");

const Todo = require("./models/todo");

// feels like creating an instance of a class
const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
  }),
);

app.listen(PORT, () => {
  //   console.log(`Server is running on ${PORT}`);
});

app.post("/create", async (req, res) => {
  try {
    // Create a new Todo document using the data received in the request body
    // todo: make case insensitive
    const newTodo = new Todo({
      title: req.body.title,
    });

    // Save the new Todo document to the database
    await newTodo.save();

    // Send a response back to the client
    res.json(newTodo);
  } catch (error) {
    // console.error(error);
    if (error.code === 11000) {
      // This error code indicates a duplicate key error (e.g., duplicate title)
      res.status(409).json({ message: "Todo with this title already exists" });
    } else {
      // Send a generic 500 Internal Server Error response for any other errors
      res.status(500).json({ message: "Server error" });
    }
  }
});

app.patch("/todo/:id", async (req, res) => {
  //   console.log(req);
  try {
    // Find the todo item by id and update its completed status
    const todo = await Todo.findByIdAndUpdate(
      req.params.id, // Get the id from the URL parameters
      { completed: req.body.completed }, // Get the new completed status from the request body
      { new: true }, // This option returns the updated document
    );
    res.json(todo); // Send the updated todo item back to the client
  } catch (error) {
    // console.error(error); // Log any server errors
    res.status(500).send("Server error"); // Send a 500 Internal Server Error response
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findByIdAndDelete(todoId);
    if (!todo) {
      res.status(404).send("Todo not found");
    }
    res.send(todo);
  } catch (error) {
    // console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/todos", async (req, res) => {
  //   console.log("Received a request to /todos");
  //   console.log("Headers:", JSON.stringify(req.headers, null, 2));
  //   console.log("Query Parameters:", JSON.stringify(req.query, null, 2));
  try {
    const todos = await Todo.find({});
    // console.log("Database Query Result:", JSON.stringify(todos, null, 2));
    res.json(todos);
  } catch (error) {
    // console.error("Error querying database:", error);
    res.status(500).send("Server error");
  }
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
