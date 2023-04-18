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
  
 