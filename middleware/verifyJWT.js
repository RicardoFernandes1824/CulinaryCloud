const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    try {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1]; // Split from the space forward + get token from array
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err,decoded) => {
            if(err) return res.sendStatus(403); // Invalid token
            req.user = {
                email: decoded.email,
                id: decoded.id
            }
            next();
        }
    )
    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }
}

module.exports = verifyJWT