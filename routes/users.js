const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const { getAllUsers } = require('../controllers/usersController');
const { createUser } = require('../controllers/usersController');
const { updateUser } = require('../controllers/usersController');


usersRouter.get('/users', getAllUsers)
usersRouter.post('/users', createUser)
usersRouter.get('/users/:id', getUserById)
usersRouter.patch('/users/:id', updateUser)


module.exports = {
    usersRouter
}