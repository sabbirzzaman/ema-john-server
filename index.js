const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b7sdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        await client.connect();
        const productsCollection = client.db('emaJohn').collection('products');

        // get all products
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const quantity = parseInt(req.query.quantity);

            const query = {};
            const cursor = productsCollection.find(query);

            let products;
            if (page || quantity) {
                products = await cursor.skip(page*quantity).limit(quantity).toArray();
            } else {
                products = await cursor.toArray();
            }

            res.send(products);
        });

        // get products count
        app.get('/productsCount', async (req, res) => {
            const productsCount =
                await productsCollection.estimatedDocumentCount();

            res.send({ productsCount });
        });
    } finally {
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema-john server is running');
});

// listen to the port
app.listen(port, () => {
    console.log('server is running');
});
