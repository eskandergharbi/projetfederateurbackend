const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Authorization Header:', token);  // Log the header to debug
  
  if (!token) return res.status(401).json({ message: "Accès non autorisé, token manquant." });

  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Format de token invalide.' });
  }

  try {
    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user info to request object
    next();  // Proceed to next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err);  // Log the error for debugging
    res.status(403).json({ message: "Token invalide." });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant." });
    }
    next();  // Proceed to next middleware or route handler
  };
};

module.exports = { authenticateToken, authorizeRole };
