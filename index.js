const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

const jwt = require('jsonwebtoken');

// middlewares

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server successfully running');
})

// connecting mongo db 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://photoMania:tpUweRoR5Xx08jSB@cluster0.akihfew.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.listen(port, () => {
    console.log('running from port - ', port);
})