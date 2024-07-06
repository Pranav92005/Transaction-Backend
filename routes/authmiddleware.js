const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Authorization header required" });
    }
    const token = authHeader.split(" ")[1];
    const authenticate = jwt.verify(token, JWT_SECRET);
    if (!authenticate) {
        return res.status(403).json({ message: "Invalid token" });
    }
    req.userid = authenticate.userid;
    next();


}
module.exports = { authMiddleware };