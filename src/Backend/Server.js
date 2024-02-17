import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import cors from 'cors'; 
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware to enable CORS

// Connection URI
const uri = 'mongodb://localhost:27017';
// Database Name
const dbName = 'URL_shortener';

app.post('/save-url', async (req, res) => {
    const { url } = req.body;

    try {
        // Connect to the MongoDB server
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Access the database
        const db = client.db(dbName);

        // Insert the URL into the collection
        await db.collection('urls').insertOne({ url });

        // Close the connection
        await client.close();

        res.json({ message: 'URL saved successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Add this endpoint to your server code
app.get('/get-urls', async (req, res) => {
    try {
        // Connect to the MongoDB server
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Access the database
        const db = client.db(dbName);

        // Retrieve the URLs from the collection
        const urls = await db.collection('urls').find().toArray();

        // Close the connection
        await client.close();

        res.json({ urls });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
