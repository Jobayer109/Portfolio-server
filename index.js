const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mqx9iof.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async (req, res) => {
  try {
    const projectCollection = client.db("my_portfolio").collection("projects");
    const skillCollection = client.db("my_portfolio").collection("skills");

    app.get("/projects", async (req, res) => {
      const projects = await projectCollection.find({}).toArray();
      res.send(projects);
    });

    app.get("/project/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await projectCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
};
dbConnect().catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.send("My portfolio server is running");
});

app.listen(port, () => {
  console.log(`Portfolio server listening on port: ${port}`);
});
