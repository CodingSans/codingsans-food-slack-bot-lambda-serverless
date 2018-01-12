'use strict';

const dotenv = require('dotenv');

module.exports = class LoadEnv {
  constructor(serverless, options) {
    dotenv.config();
  }
}