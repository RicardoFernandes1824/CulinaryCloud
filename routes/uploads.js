const express = require('express');
const { createUpload } = require('../controllers/uploadControllers');
const uploadsRouter = express.Router();

uploadsRouter.post('/upload/:recipeId', createUpload)

module.exports = {
    uploadsRouter
}