const express = require('express');
const mongoose = require('mongoose');
const app = express();


app.use(express.json());

mongoose.connect('mongodb://localhost:27017/animalsMERN',
 { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established');
})

const animalsRouter = require('./routes/animals');
app.use('/animals', animalsRouter)

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));