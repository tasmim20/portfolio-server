const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
//parsers
app.use(express.json());

// app.use(
//   cors({
//     origin: ["https://direct-relief-client.vercel.app"],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: ["https://tasmim-portfolio.netlify.app"],
  })
);

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const projectCollection = db.collection("projects");
    const skillsCollection = db.collection("skills");
    const blogsCollection = db.collection("blogs");

    // // User Registration
    // app.post("/api/auth/register", async (req, res) => {
    //   const { name, email, password } = req.body;

    //   // Check if email already exists
    //   const existingUser = await collection.findOne({ email });
    //   if (existingUser) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "User already exists",
    //     });
    //   }

    //   // Hash the password
    //   const hashedPassword = await bcrypt.hash(password, 10);

    //   // Insert user into the database
    //   await collection.insertOne({ name, email, password: hashedPassword });

    //   res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //   });
    // });

    // // User Login
    // app.post("/api/auth/login", async (req, res) => {
    //   const { email, password } = req.body;

    //   // Find user by email
    //   const user = await collection.findOne({ email });
    //   if (!user) {
    //     return res.status(401).json({ message: "Invalid email or password" });
    //   }

    //   // Compare hashed password
    //   const isPasswordValid = await bcrypt.compare(password, user.password);
    //   if (!isPasswordValid) {
    //     return res.status(401).json({ message: "Invalid email or password" });
    //   }

    //   // Generate JWT token
    //   const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.EXPIRES_IN,
    //   });

    //   res.json({
    //     success: true,
    //     message: "Login successful",
    //     token,
    //   });
    // });

    //get skills api
    app.get("/api/skills", async (req, res) => {
      const result = await skillsCollection.find({}).toArray();
      if (result.length) {
        res.send({ result, success: true });
      } else {
        res.send({ success: false, message: "Something went wrong" });
      }
    });
    //get project api
    app.get("/api/projects", async (req, res) => {
      const result = await projectCollection.find({}).toArray();
      if (result.length) {
        res.send({ result, success: true });
      } else {
        res.send({ success: false, message: "Something went wrong" });
      }
    });
    //get blog api
    app.get("/api/blogs", async (req, res) => {
      const result = await blogsCollection.find({}).toArray();
      if (result.length) {
        res.send({ result, success: true });
      } else {
        res.send({ success: false, message: "Something went wrong" });
      }
    });

    //skills post api
    app.post("/api/skills", async (req, res) => {
      const skills = req.body;
      const result = await skillsCollection.insertOne(skills);
      if (result.insertedId) {
        res.send({ result, success: true });
      } else {
        res.send({ success: false, message: "Something went wrong" });
      }
    });
    //project post api
    app.post("/api/projects", async (req, res) => {
      const projects = req.body;
      const result = await projectCollection.insertOne(projects);
      if (result.insertedId) {
        res.send({ result, success: true });
      } else {
        res.send({ success: false, message: "Something went wrong" });
      }
    });
    //blog post api
    app.post("/api/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      if (result.insertedId) {
        res.send({ result, success: true });
      } else {
        res.send({ success: false, message: "Something went wrong" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
