const express = require('express');
const { createRecipe, updateRecipeByUser, getAllRecipesByUser, getAllRecipes, deleteRecipe } = require('../controllers/recipeControllers');
const recipeRouter = express.Router();

recipeRouter.get('/recipe', getAllRecipes)

recipeRouter.get('/users/:id/recipe', getAllRecipesByUser)

recipeRouter.post('/recipe', createRecipe)

recipeRouter.patch('/users/:authorId/recipe/:id', updateRecipeByUser)

recipeRouter.delete('/users/:userId/recipe/:recipeId', deleteRecipe)

module.exports = {
    recipeRouter
}