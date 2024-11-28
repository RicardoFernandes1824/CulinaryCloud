const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');



// tenho de criar as rotas

router.route('/')
.get()
.post()
.put()
.delete();

router.route('/:id')
.get();

module.exports = router;