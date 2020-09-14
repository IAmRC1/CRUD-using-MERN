const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = () => {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};

module.exports = connectDB;
