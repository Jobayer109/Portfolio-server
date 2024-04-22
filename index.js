const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uadfpu7.mongodb.net`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Connect to MongoDB and define route handlers
async function dbConnect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const projectCollection = db.collection("projects");
    // const skillCollection = db.collection("skills");

    // Define route handlers
    app.get("/projects", async (req, res) => {
      const projects = await projectCollection.find({}).toArray();
      res.status(200).json(projects);
    });

    app.get("/project/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const project = await projectCollection.findOne(query);
      res.json(project);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

dbConnect()
  .then(() => {
    // Start the server
    app.listen(port, () => {
      console.log(`Portfolio server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
