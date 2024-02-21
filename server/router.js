const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("todosdb").collection("todos");
  return collection;
}

// : GET DATA BY ID
router.get("/todos/:id", async (req, res) => {
  try {
    console.log("Fetching todo by ID...");
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    console.log("Todo ID:", _id);
    const todo = await collection.findOne({ _id });

    if (!todo) {
      console.log("Todo not found");
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//  : GET DATA
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
})

//  : POST DATA
router.post("/todos", async (req, res) => {
  const collection = getCollection();
  let { todo, dateAdded, dueDate } = req.body;

  if(!todo)
  {
   return res.status(400).json({ mssg : "No TODO found. Try Again!" });
  }

  todo = typeof todo === 'string' ? todo : JSON.stringify(todo) 
  dateAdded = typeof dateAdded === "string" ? dateAdded : JSON.stringify(dateAdded); 

  const newTodo = await collection.insertOne({todo, dateAdded, dueDate, status: false});

  res.status(201).json({todo, status : false, _id : newTodo.insertedId});
});

//  : DELETE DATA
router.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  const deleteTodo = await collection.deleteOne({ _id });
  res.status(200).json(deleteTodo);
});

//  : PUT DATA
router.put("/todos/:id", async (req, res) => {
   const collection = getCollection();
   const _id = new ObjectId(req.params.id);
   const { status, dueDate } = req.body;

  //  if( typeof status !== Boolean){
  //   return res.status(400).json({mssg : "Invalid parameter"})
  //  }

   const updateTodo = await collection.updateOne(
     { _id },
     { $set: { status: !status , dueDate} }
   );
   
  res.status(200).json(updateTodo);
});


module.exports = router;