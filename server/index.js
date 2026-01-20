const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });

async function run() {
  try {
    const db = client.db("styleDecorDB");
    const servicesCollection = db.collection("services");
    const bookingsCollection = db.collection("bookings");
    const usersCollection = db.collection("users");

    // Get all bookings for Admin
    app.get('/admin/bookings', async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.send(result);
    });

    // Assign Decorator to a booking
    app.patch('/admin/assign-decorator/:id', async (req, res) => {
      const id = req.params.id;
      const { decoratorEmail } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { assignedDecorator: decoratorEmail, status: "Planning Phase" } };
      const result = await bookingsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    console.log("Connected to MongoDB");
  } finally {}
}
run().catch(console.dir);
app.listen(port, () => console.log(`Server running on ${port}`));