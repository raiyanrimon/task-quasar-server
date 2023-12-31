const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hif0lwq.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    const taskCollection = client.db('taskquasar').collection('task')

    app.post('/task',  async(req, res)=>{
      const task = req.body
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })

   

    app.get('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

    app.get('/task', async (req, res)=>{
      const email = req.query.email
      const query = {email: email}
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })



    app.patch('/task/:id', async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          title: item.title,
          priority: item.priority,
          deadline: item.deadline,
          description: item.description,
        
        }
      }

      const result = await taskCollection.updateOne(filter, updatedDoc)
      res.send(result);
    })

    app.delete('/task/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)

    } )

  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Task Quasar Server Running')
})

app.listen(port, ()=>{
    console.log(`Task Quasar Server Running on port ${port}`);
})