const express = require('express');
const { createUpload, updateUpload } = require('../controllers/uploadControllers');
const uploadsRouter = express.Router();

uploadsRouter.post('/upload/:recipeId', createUpload)

uploadsRouter.patch('/upload/:recipeId', updateUpload)

module.exports = {
    uploadsRouter
}