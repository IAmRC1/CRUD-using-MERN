const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const auth = require('./middleware/auth.middleware')


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/animalsMERN',
 { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established');
})

const animalsRouter = require('./routes/animals');
app.use('/animals', animalsRouter)
const usersRouter = require('./routes/users');
app.use('/users', usersRouter)
const authRouter = require('./routes/auth');
app.use('/auth', authRouter)



const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));