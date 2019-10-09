  const express = require("express");
const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

const app = express();

// Middleware bech tbadlena ay 7aja el json*****
app.use(express.json());

//connect db 
//url mta3 el mongo 3al port 27017

const MongoURL = "mongodb://localhost:27017";
const database = "contactList";

MongoClient.connect(MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, (err, client) => {
  assert.equal(err, null, 'cannot connect on database');
  const db = client.db(database)

 // GET all dataaa 3andna fel contactList
  app.get('/contacts', (req, res) => {
  db.collection('contact')
  .find()
  .toArray()
  .then((data) => res.send(data)).catch(err => res.send("cannot get contacts"))
});

// GET one data

  app.get('/contacts/:id', (req, res) => {
  console.log("object")
  const id = ObjectID(req.params.id)
  db.collection('contact')
  .findOne({_id: id})
  .then((data) => res.send(data))
  .catch(err => res.send("cannot get contacts"))
});

// ADD one data
  app.post('/contacts', (req, res) => {
  const newContact = req.body
  db.collection("contact")
  .insertOne({...newContact})
  .then(res.send('contact added'))
  .catch(res.send('cannot add contact'))
})

// DELETE one data
  app.delete("/contacts/:id", (req, res) => {
  const id = ObjectID(req.params.id)
  db.collection("contact")
  .findOneAndDelete({_id: id})
  .then(res.send("contact deleted"))
  .catch(res.send("cannot delete contact"))
})


// EDIT one data
app.put("/contacts/:id", (req, res) => {
  const id = ObjectID(req.params.id)
  const newContact = req.body
  console.log(id);
  db.collection("contact").findOneAndUpdate({_id: id },
     {
       $set: {...newContact}
  })
  .then(res.send("contact updated"))
  .catch(res.send("cannot update contact"))
  
});


});

const PORT = process.env.PORT || 2000

app.listen(PORT, err => {
    if (err) 
        console.log("cannot connect to database")
    console.log(`server is running on port ${PORT}`)
  });