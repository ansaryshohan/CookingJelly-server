const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    app.post('/addedTopProducts',async(req,res)=>{
      const productData= req.body;
      const result= await topProductDB.insertOne(productData)
      res.send({message:true, data:result})
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
      const query = { product_id: { $eq: id } }
      const singleProduct = await allSingleProductDB.findOne(query);
      res.send({ message: 'true', data: singleProduct });
    })

    app.get('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { productId: { $eq: id } }
      const result = await allReviewDB.find(query).toArray();
      res.send({ message: "true from id", data: result });
    })
    app.get('/reviewByEmail/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await allReviewDB.find(query).toArray();
      res.send({ message: 'true from email', data: result });
    })
    app.get('/reviewUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result =await allReviewDB.findOne(query);
      res.send({ message: "true from update id", data: result });
     console.log(query)
    })

    app.put('/reviewUpdate/:id',async(req,res)=>{

      const id= req.params.id;
      const data = req.body;
      const query= {_id:ObjectId(id)}
      const option= {upsert:true}
      const updatedData= {$set:req.body};
      const result= await allReviewDB.updateOne(query,updatedData,option)
      res.send({message:"true", data:result})
      console.log(result)
    })

    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await allReviewDB.insertOne(review);
    })
    app.delete('/deleteReview/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await allReviewDB.deleteOne(query);
      res.send({ message: "true from delete", data: result });
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