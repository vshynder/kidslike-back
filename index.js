const express = require('express');
const mongoose = require('mongoose');

const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');

class Server {
  constructor() {
    this.server = express();
    this.PORT = process.env.PORT || 1717;
    this.CONNECT_DB_STRING = process.env.CONNECT_DB_STRING || '';
  }

  async start() {
    this.initMiddlewares();
    this.initRoutes();
    await this.connectDB();
    this.handleErrors();
    this.startListening();
  }

  initMiddlewares() {
    this.server.use(morgan('dev'));
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(this.handleErrors);
  }

  initRoutes() {}

  async connectDB() {
    mongoose
      .connect(this.CONNECT_DB_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
  }

  startListening() {
    this.server.listen(this.PORT, () =>
      console.log(`Server is running on port ${this.PORT}`),
    );
  }

  handleErrors(error, req, res, next) {
    console.log('Error Code', error.code);
    console.log('Error message', error.message);
  }
}

const server = new Server();
server.start();
