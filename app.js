
const express = require('express');
const cors = require('cors');
const path = require("path");
const session = require('express-session'); // Add this line
const bodyParser = require('body-parser');
const { connectToDb } = require('./Db/Db');
const { PORT, DB_NAME, SESSION_SECRET } = require('./Config/Config');
const assetsRoutes = require('./Routes/assets.route');
const cron = require("node-cron");
const notifyUsersAboutExpiringCerts = require("./utils/checkAndNotifyExpiringCerts");
//  Make sure you have this

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));  


// Session Configuration (Add this before other middleware)
app.use(session({
  secret: SESSION_SECRET || 'your-secret-key-here', // Should be in your config
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    // secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
    secure: false, // Set to true if using HTTPS in production
    httpOnly: true,
    maxAge: 3000000,
    sameSite: "lax",// 24 hours
  }
}));

// Middleware Setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Custom middleware for logging
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    session: req.session ? 'exists' : 'undefined' // Debug session
  });
  next();
});
app.get("/session-check", (req, res) => {
  const session = req.session;

  if (!session || !session.user || !session.createdAt) {
    return res.status(200).json({ loggedIn: false });
  }

  const now = Date.now();
  const sessionAge = now - session.createdAt;

  if (sessionAge > 3000000) { // 1 minute
    req.session.destroy(() => {
      console.log("Session expired and destroyed.");
      res.status(200).json({ loggedIn: false });
    });
  } else {
    res.status(200).json({ loggedIn: true });
  }
});



// Routes
app.use('/', assetsRoutes);
app.use('/users', assetsRoutes); // Make sure user routes are included

// Root route
app.get('/', (req, res) => {
  res.send("Hey! The Nic is running.");
});

// Error handling middleware (add at the end)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server is running and connected to MongoDB '${DB_NAME}' on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
// cron.schedule("0 9 * * *", async () => {
//   console.log("🔔 Running scheduled SSL/TLS expiry check...");
//   try {
//     await notifyUsersAboutExpiringCerts();
//     console.log("✅ Notification job completed");
//   } catch (err) {
//     console.error("❌ Notification job failed:", err);
//   }
// });

startServer();

module.exports = app;