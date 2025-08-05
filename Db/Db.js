// Db/Db.js
const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB_NAME } = require("../Config/Config");

let clientInstance = null;

/**
 * Connects to the MongoDB database and reuses the connection if already established.
 * @returns {Promise<MongoClient>} The connected MongoClient instance.
 */
async function connectToDb() {
  // As of MongoDB Node.js Driver v4.x+, isConnected() is deprecated.
  // A more modern check might involve trying a simple operation or checking client.topology.isConnected()
  // or simply relying on the connect() call to establish/re-establish.
  // For simplicity and avoiding a breaking change, we'll keep the direct check if using older client versions,
  // but be aware of its deprecation.
  if (clientInstance && clientInstance.topology && clientInstance.topology.isConnected()) {
    console.log("Already connected to MongoDB, reusing existing connection.");
    return clientInstance;
  }

  try {
    const client = new MongoClient(MONGODB_URI); // No options needed here anymore for useNewUrlParser and useUnifiedTopology

    await client.connect();
    clientInstance = client;
    console.log(`Connected to MongoDB: ${DB_NAME}`);
    return clientInstance;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

/**
 * Returns the database instance. Throws an error if not connected.
 * @returns {import('mongodb').Db} The MongoDB database instance.
 */
function getDb() {
  if (!clientInstance) {
    throw new Error("Database not connected. Call connectToDb first.");
  }
  return clientInstance.db(DB_NAME);
}

/**
 * Closes the MongoDB connection.
 * @returns {Promise<void>}
 */
async function closeDb() {
  if (clientInstance) {
    await clientInstance.close();
    clientInstance = null;
    console.log("MongoDB connection closed.");
  }
}

module.exports = { connectToDb, getDb, closeDb };

