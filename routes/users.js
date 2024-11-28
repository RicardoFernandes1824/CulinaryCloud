const express = require('express');
const usersRouter = express.Router();
const { getAllUsers, updateUser, createUser, getUserById } = require('../controllers/usersControllers');
const verifyJWT = require('../middleware/verifyJWT'); // nao sei se vou usar


usersRouter.get('/users', getAllUsers)
usersRouter.post('/users', createUser)
usersRouter.get('/users/:id', getUserById)
usersRouter.patch('/users/:id', updateUser)


module.exports = {
    usersRouter
}