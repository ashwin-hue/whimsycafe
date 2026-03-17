const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

// ================= MIDDLEWARE =================

// Allow requests (for testing allow all, restrict later)
app.use(cors({
    origin: '*'
}));

app.use(express.json());

// ================= DATABASE =================

const uri = "mongodb+srv://whimsy:whimsy123@cluster0.kx67hbl.mongodb.net/?appName=Cluster0"; // 🔴 replace this
const client = new MongoClient(uri);

let db;

// ================= START SERVER =================

async function startServer() {
    try {
        await client.connect();
        db = client.db("whimsy_cafe");
        console.log("✅ MongoDB Connected");

        const PORT = process.env.PORT || 10000;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Failed to start server:", err);
    }
}

startServer();

// ================= API ROUTES =================

// 🔹 Test route (check if server works)
app.get('/', (req, res) => {
    res.json({ message: "API is running 🚀" });
});

// 🔹 Get all drinks
app.get('/api/drinks', async (req, res) => {
    try {
        const drinks = await db.collection("drinks").find().toArray();
        res.json(drinks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const order = req.body;

        if (!order || Object.keys(order).length === 0) {
            return res.status(400).json({ error: "Empty order data" });
        }

        const result = await db.collection("orders").insertOne(order);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await db.collection("orders").find().toArray();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Delete order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const result = await db.collection("orders").deleteOne({
            _id: new ObjectId(id)
        });

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
