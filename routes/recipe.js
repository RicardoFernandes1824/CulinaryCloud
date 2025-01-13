const express = require('express');
const { createRecipe, updateRecipeByUser, getRecipeByUserById, getAllPublicRecipesByUser, getAllRecipesByUser, getAllRecipes, deleteRecipe } = require('../controllers/recipeControllers');
const recipeRouter = express.Router();

recipeRouter.get('/recipe', getAllRecipes)

recipeRouter.get('/users/:id/recipe', getAllRecipesByUser)

recipeRouter.get('/users/:id/recipe/public', getAllPublicRecipesByUser)

recipeRouter.get('/users/:authorId/recipe/:id', getRecipeByUserById)

recipeRouter.post('/recipe', createRecipe)

recipeRouter.patch('/users/:authorId/recipe/:id', updateRecipeByUser)

recipeRouter.delete('/users/:authorId/recipe/:id', deleteRecipe)

module.exports = {
    recipeRouter
}