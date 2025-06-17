// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { connectToDb } = require('./Db/Db'); // Import connectToDb
// const { PORT, DB_NAME } = require('./Config/Config'); // Import PORT and DB_NAME from config
// const assetsRoutes = require('./Routes/assets.route'); // Import assets routes

// const app = express();

// // Middleware Setup
// // Order matters for middleware!
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow only your frontend origin
//   credentials: true                // Allow cookies and credentials
// }));
// app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with a larger limit
// app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded bodies

// // Custom middleware for logging content length (optional, for debugging)
// app.use((req, res, next) => {
//   console.log('Request content length:', req.headers['content-length']);
//   next();
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send("Hey! The Nic is running.");
// });

// // Routes
// app.use('/', assetsRoutes); // Mount assets routes

// // Function to start the server
// async function startServer() {
//   try {
//     await connectToDb(); // Connect to the database

//     // Listen for incoming requests
//     app.listen(PORT, () => {
//       // This message will only appear if both DB connection and server listening are successful
//       console.log(`Server is running and connected to MongoDB '${DB_NAME}' on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1); // Exit if server cannot start
//   }
// }

// startServer(); // Call the function to start the server

// module.exports = app;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToDb } = require('./Db/Db'); // Import connectToDb
const { PORT, DB_NAME } = require('./Config/Config'); // Import PORT and DB_NAME from config
const assetsRoutes = require('./Routes/assets.route'); // Import assets routes

const app = express();

// Middleware Setup
// Order matters for middleware!
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend origin
  credentials: true                // Allow cookies and credentials
}));
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with a larger limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded bodies

// Custom middleware for logging content length (optional, for debugging)
app.use((req, res, next) => {
  console.log('Request content length:', req.headers['content-length']);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send("Hey! The Nic is running.");
});

// Routes
app.use('/', assetsRoutes); // Mount assets routes

// Function to start the server
async function startServer() {
  try {
    await connectToDb(); // Connect to the database

    // Listen for incoming requests
    app.listen(PORT, () => {
      // This message will only appear if both DB connection and server listening are successful
      console.log(`Server is running and connected to MongoDB '${DB_NAME}' on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit if server cannot start
  }
}

startServer(); // Call the function to start the server

module.exports = app;