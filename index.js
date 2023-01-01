const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

//Database connection

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9rpk71q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const TaskCollection = client.db("Taskey").collection("TaskCollection");
        //adding a task
        app.post('/add-task', async (req, res) => {
            const task = req.body;
            console.log(task);
            const result = await TaskCollection.insertOne(task);
            console.log(result);
            res.send(result);
        });

        app.get('/my-task/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            // console.log(query);
            const result = await TaskCollection.find(query).toArray();
            res.send(result);
            
        })
        // delete a task
        app.delete('/my-task/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await TaskCollection.deleteOne(query);
            res.send(result);
        });

        // update a task  
        app.put('/add-task/:id', async (req, res) => {
            const id = req.params.id;
            const addTask = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: addTask,
            }
            const result = await TaskCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });


    }
    finally {
        
    }
}

run().catch(err => console.log(err))


app.get('/', async (req, res) => {
    res.send('Taskey server is running');
})

app.listen(port, () => console.log(`Taskey running on ${port}`))
