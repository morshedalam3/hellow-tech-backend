const express = require('express')
const MongoClient = require('mongodb').MongoClient;
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
  console.log('mongodb connected successfully')

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

});
const pass = 'VZGKVEoZNAFOfqD7'
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })