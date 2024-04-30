const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const { ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

// Enable CORS
app.use(cors());

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
    const contributionsCollection = db.collection("contributions");

    // Define route handlers
    app.get("/", async (req, res) => {
      res.send("No worry, I'm alive");
    });

    // _______________________Projects______________________

    app.get("/projects", async (req, res) => {
      const projects = await projectCollection.find({}).toArray();
      res.status(200).json(projects);
    });

    app.get("/project/:id", async (req, res) => {
      const id = req.params.id;

      // Check if id is a valid Object ID
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const query = { _id: ObjectId(id) };
      try {
        const project = await projectCollection.findOne(query);
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
      } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // _______________________Contributions______________________

    app.get("/contributions", async (req, res) => {
      const contributions = await contributionsCollection.find({}).toArray();
      res.status(200).json(contributions);
    });

    app.get("/contribution/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid contribution ID" });
      }

      const query = { _id: ObjectId(id) };
      try {
        const contribution = await contributionsCollection.findOne(query);
        if (!contribution) {
          return res.status(404).json({ error: "Contribution not found" });
        }
        console.log("contribution", contribution);
        res.status(200).json(contribution);
      } catch (error) {
        console.error("Error fetching contribution:", error);
        res.status(500).json({ error: "Internal server error" });
      }
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
