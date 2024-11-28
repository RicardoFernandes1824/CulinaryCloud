const express = require('express');
const {login} = require('../controllers/authController');
const { createUser } = require('../controllers/usersControllers');
const accountRouter = express.Router();

accountRouter.post('/login', login)
accountRouter.post('/register', createUser)


module.exports = {
    accountRouter
}
