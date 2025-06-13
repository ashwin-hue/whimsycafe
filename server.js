const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const uri = "mongodb+srv://whimsycafeofficial:WUF9GW8HctTyNkyj@cluster0.xf19ewb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','views', 'index.html'));
});

app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','views', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','views','admin.html'));
});

// API endpoints remain the same as before
app.get('/api/drinks', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("whimsy_cafe");
        const drinks = await db.collection("drinks").find().toArray();
        res.json(drinks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("whimsy_cafe");
        const result = await db.collection("orders").insertOne(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("whimsy_cafe");
        const orders = await db.collection("orders").find().toArray();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("whimsy_cafe");
        const result = await db.collection("orders").deleteOne({ _id: new ObjectId(req.params.id) });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});