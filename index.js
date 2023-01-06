const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.evsael1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  const topProductDB = client.db("clientJellyDB").collection("topProducts");
  const allProductDB = client.db("clientJellyDB").collection("products");
  const allSingleProductDB = client.db("clientJellyDB").collection("allProducts");
  const allReviewDB = client.db("clientJellyDB").collection("reviews");

  try {

    app.get('/topProducts', async (req, res) => {
      const query = {};
      const products = await topProductDB.find(query).toArray();
      res.send(products);
    })

    app.get('/topThree', async (req, res) => {
      const products = await topProductDB.find({}).limit(3).toArray();
      res.send({ message: "true", "data": products })
    })

    app.get('/allProducts', async (req, res) => {
      const query = {};
      const products = await allProductDB.find(query).toArray()
      res.send({ message: "true", "data": products })
    })

    app.get('/singleProduct/:id', async (req, res) => {
      const id = parseInt(req.params.id)
      // console.log(id);
      const query = { product_id: { $eq: id } }
      const singleProduct = await allSingleProductDB.findOne(query);
      // console.log(singleProduct)
      res.send({ data: singleProduct })
    })
    app.post('/review', async(req, res) => {
      const review = req.body;
// console.log(review);
      const result =await allReviewDB.insertOne(review)
      // res.send(result)
      console.log(result)
    })

  }
  catch (err) {

  }

}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send({ message: 'server is running' })
})

app.listen(port, () => {
  console.log('server running on port:', port)
})
module.exports = app;