const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b7sdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try{
        console.log("MongoDB connected")
    }
    finally{

    }
}

run().catch(console.dir)

//
app.get('/', (req, res) => {
    res.send('Ema-john server is running');
});

app.listen(port, () => {
    console.log('server is running');
});
