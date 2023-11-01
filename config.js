const dotenv = require('dotenv');

dotenv.config();
const { env } = process;

module.exports = {
  JWT_SECRET: env.JWT_SECRET,
  PORT: env.PORT || 9000,
  MONGODBURI: env.MONGODBURI,
  
};