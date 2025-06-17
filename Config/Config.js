require('dotenv').config(); // Load environment variables at the very top

module.exports = {
  // MongoDB Connection
  // Change "localhost" to "127.0.0.1" to ensure IPv4 connection
  MONGO_HOST: process.env.MONGO_HOST || "127.0.0.1",
  MONGO_PORT: parseInt(process.env.MONGO_PORT, 10) || 27017,
  DB_NAME: process.env.DB_NAME || "Digital_assets",

  get MONGODB_URI() {
    return `mongodb://${this.MONGO_HOST}:${this.MONGO_PORT}/${this.DB_NAME}`;
  },

  // Server Configuration
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Security
  JWT_SECRET: process.env.JWT_SECRET || "supersecretjwtkeythatshouldbechangedinproduction",
};

