// Import the necessary modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');


// Create an instance of the express app
const app = express();

// Set up the session middleware
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // Set session timeout to 1 hour
}));

// Set up the body parser middleware
app.use(bodyParser.json());

// Middleware to check if public key has been received within the timeout period
const checkSession = (req, res, next) => {
  const { publicKey } = req.body;
  
  // Check if public key has been received within the timeout period
  if (!publicKey && req.session.lastAccessTime && (new Date() - req.session.lastAccessTime) > 3600000) {
    // Clear session if public key has not been received within the timeout period
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  
  // Save last access time to session
  req.session.lastAccessTime = new Date();
  
  next();
};

// First API endpoint to save public key, private key, and user credentials in session
app.post('/save', (req, res) => {
  const { publicKey, privateKey} = req.body;
  
  // Set session data
  req.session.publicKey = publicKey;
  req.session.privateKey = privateKey;
//   req.session.userCredentials = { username, password };
  
  res.send('Session data saved!');
});

// Second API endpoint to retrieve session data and save user data to MongoDB
app.post('/match', checkSession, (req, res) => {
  const { publicKey, userData } = req.body;
  const { privateKey, userCredentials } = req.session;
  
  // Check if public key matches the one saved in session
  if (publicKey !== req.session.publicKey) {
    res.status(401).send('Unauthorized');
    return;
  }
  console.log("session",req.session);
  console.log(publicKey,privateKey);
    res.json("matched")
});
app.listen(3033, () => console.log('Server started on port 3033'));


