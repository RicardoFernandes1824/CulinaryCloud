const express = require('express');
const { createRecipe, updateRecipeByUser, getPublicRecipeById, getAllPublicRecipesByUser, getAllRecipesByUser, getRecipeByUser, getAllRecipes, deleteRecipe } = require('../controllers/recipeControllers');
const recipeRouter = express.Router();

recipeRouter.get('/recipe', getAllRecipes)

recipeRouter.get('/users/:id/recipe', getAllRecipesByUser)

recipeRouter.get('/users/:id/recipe/public', getAllPublicRecipesByUser)

recipeRouter.get('/recipe/:id', getPublicRecipeById)

recipeRouter.get('/users/:authorId/recipe/:id', getRecipeByUser)

recipeRouter.post('/recipe', createRecipe)

recipeRouter.patch('/users/:authorId/recipe/:id', updateRecipeByUser)

recipeRouter.delete('/users/:authorId/recipe/:id', deleteRecipe)

module.exports = {
    recipeRouter
}