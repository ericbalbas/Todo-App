require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.json());
const {connectToMongoDb } = require("./database");
const path = require("path");
const router = require("./router");

app.use('/api',router)
app.use(express.static(path.join(__dirname,"build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"build/index.html"));
})
const port = process.env.PORT || 4000;

const startServer = async () => {
    await connectToMongoDb();
    app.listen(port, () => {
      console.log(`Server is listening @ http://localhost:${port}`);
    });
}

startServer();