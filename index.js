const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // load all products
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

        // load products count
        app.get('/productsCount', async (req, res) => {
            const productsCount =
                await productsCollection.estimatedDocumentCount();

            res.send({ productsCount });
        });

        // get products by keys 
        app.post('/productsByKeys', async (req, res) => {
            const keys = req.body;
            const IDs = keys.map(id => ObjectId(id))
            const query = {_id: {$in: IDs}}
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            console.log(keys)
            res.send(result)
        })
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
