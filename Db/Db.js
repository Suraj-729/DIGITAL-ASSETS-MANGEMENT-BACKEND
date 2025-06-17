// Db/Db.js
const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB_NAME } = require("../Config/Config");

let clientInstance = null;

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

// Function to get the database instance
function getDb() {
  if (!clientInstance) {
    throw new Error("Database not connected. Call connectToDb first.");
  }
  return clientInstance.db(DB_NAME);
}

// Function to close the database connection
async function closeDb() {
  if (clientInstance) {
    await clientInstance.close();
    clientInstance = null;
    console.log("MongoDB connection closed.");
  }
}

module.exports = { connectToDb, getDb, closeDb };


// // Db/Db.js
// const { MongoClient } = require("mongodb");
// const { MONGODB_URI, DB_NAME } = require("../Config/Config");

// let clientInstance = null;

// async function connectToDb() {
//   try {
//     if (clientInstance) {
//       // Ping to ensure it's still alive
//       await clientInstance.db(DB_NAME).command({ ping: 1 });
//       console.log("✅ Reusing existing MongoDB connection.");
//       return clientInstance;
//     }

//     const client = new MongoClient(MONGODB_URI);
//     await client.connect();
//     clientInstance = client;
//     console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
//     return clientInstance;
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// }

// function getDb() {
//   if (!clientInstance) {
//     throw new Error("❌ DB not connected. Call connectToDb() first.");
//   }
//   return clientInstance.db(DB_NAME);
// }

// async function closeDb() {
//   if (clientInstance) {
//     await clientInstance.close();
//     clientInstance = null;
//     console.log("✅ MongoDB connection closed.");
//   }
// }

// module.exports = { connectToDb, getDb, closeDb };