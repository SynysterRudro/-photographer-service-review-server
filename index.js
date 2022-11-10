const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

const jwt = require('jsonwebtoken');

// dot env environment variable 
require('dotenv').config();

// middlewares

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server successfully running');
})

// connecting mongo db 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.akihfew.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const serviceCollection = client.db('photoMania').collection('services');
    const reviewsCollection = client.db('photoMania').collection('reviews');

    // limiting 3 services
    app.get('/servicesLimit', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);
    });

    // getting all services 
    app.get('/services', async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })

    // dynamic id of services 

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const services = await serviceCollection.findOne(query);
        res.send(services);
    })


    // reviews links 

    app.get('/reviews', async (req, res) => {
        // console.log(req.query.service_id);
        let query = {};
        if (req.query.service_id) {
            query = {
                service_id: req.query.service_id
            }
        }
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    })

    // posting reviews
    app.post('/reviews', async (req, res) => {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        // console.log(result);
        res.send(result);
    })

    // my review section 
    app.get('/myreviews', async (req, res) => {
        // console.log(req.query);
        let query = {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    })

}
run().catch(err => console.error(err))


app.listen(port, () => {
    console.log('running from port - ', port);
})