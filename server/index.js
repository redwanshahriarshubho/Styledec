const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function run() {
  try {
    const db = client.db("styleDecorDB");
    const servicesCollection = db.collection("services");
    const bookingsCollection = db.collection("bookings");
    const usersCollection = db.collection("users");
    const paymentsCollection = db.collection("payments");

    // --- SECURITY MIDDLEWARES ---

    // 1. Verify JWT Token
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' });
        }
        req.decoded = decoded;
        next();
      });
    };

    // 2. Verify Admin Role (Must call verifyToken first)
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email: email });
      if (user?.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next();
    };

    // --- AUTH & USER APIs ---

    // Create/Update JWT Token
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.send({ token });
    });

    // Check User Role
    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send({ role: user?.role || 'user' });
    });

    // Save User to DB during Register
    app.post('/users', async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) return res.send({ message: 'user already exists' });
        const result = await usersCollection.insertOne({ ...user, role: 'user' });
        res.send(result);
    });

    // --- SERVICE APIs ---

    // Public: Get all services (with search/filter query support)
    app.get('/services', async (req, res) => {
      const { search, type } = req.query;
      let query = {};
      if (search) query.service_name = { $regex: search, $options: 'i' };
      if (type) query.service_category = type;
      
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
    });

    // Admin Only: Add new service
    app.post('/services', verifyToken, verifyAdmin, async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });

    // --- BOOKING & WORKFLOW APIs ---

    // Create Booking
    app.post('/bookings', verifyToken, async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // Admin: Get all bookings to manage
    app.get('/admin/bookings', verifyToken, verifyAdmin, async (req, res) => {
        const result = await bookingsCollection.find().toArray();
        res.send(result);
    });

    // Admin: Assign Decorator to a Paid project
    app.patch('/admin/assign-decorator/:id', verifyToken, verifyAdmin, async (req, res) => {
        const id = req.params.id;
        const { decoratorEmail } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: { 
                assignedDecorator: decoratorEmail, 
                status: "Planning Phase" // Moving from 'Assigned' to first workflow step
            }
        };
        const result = await bookingsCollection.updateOne(filter, updateDoc);
        res.send(result);
    });

    // Decorator: Get my assigned tasks
    app.get('/decorator-tasks/:email', verifyToken, async (req, res) => {
        const email = req.params.email;
        const query = { assignedDecorator: email };
        const result = await bookingsCollection.find(query).toArray();
        res.send(result);
    });

    // Decorator/Admin: Update status flow
    app.patch('/update-status/:id', verifyToken, async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        );
        res.send(result);
    });

    // --- PAYMENT APIs ---

    app.post('/create-payment-intent', verifyToken, async (req, res) => {
        const { price } = req.body;
        if (price < 1) return;
        const amount = parseInt(price * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    });

    console.log("✅ StyleDecor Database Heartbeat: Active");
  } finally {}
}
run().catch(console.dir);

app.get('/', (req, res) => res.send('StyleDecor API is active.'));
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));