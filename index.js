const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port=process.env.PORT||5000;

const app= express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.evsael1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
     const topProductDB= client.db("clientJellyDB").collection("topProducts");

     try{

      app.get('/topproducts',async(req,res)=>{
          const query={};
          const products= await topProductDB.find(query).toArray();
          res.send(products);
      })

     }
     catch(err){

     }

}

run().catch(err=>console.log(err));

app.get('/',(req,res)=>{
  res.send({message:'server is running'})
})

app.listen(port,()=>{
  console.log('server running on port:',port)
})