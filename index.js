const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config();


const app = express()
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ossg7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connect error', err)
  const productCollection = client.db("techworld").collection("techinfo");
  const orderCollection = client.db("techworld").collection("order");
  console.log('mongodb connected successfully')

  app.get('/orderedProduct', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, items) => {
      console.log('order', items)
      res.send(items)
  })
  })

  app.post('/adOrder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder)
    orderCollection.insertOne(newOrder)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})

  app.post('/addProducts', (req, res) => {
    const newProduct =req.body;
    console.log('adding new event', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      res.send( {count: result.insertedCount} )
    })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    productCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
})

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })