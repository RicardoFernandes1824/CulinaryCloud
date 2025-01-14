const express = require('express');
const { getFavouritesByID, addFavouriteRecipe , deleteFavouritesByID } = require('../controllers/favouriteControllers');
const favouriteRouter = express.Router();

favouriteRouter.get('/users/:usersID/favourites', getFavouritesByID)
favouriteRouter.post('/favourites', addFavouriteRecipe)
favouriteRouter.delete('/favourites/:recipeId', deleteFavouritesByID)

module.exports = {
    favouriteRouter
}