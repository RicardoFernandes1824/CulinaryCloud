const express = require('express');
const { getFavouritesByID, addFavouriteRecipe } = require('../controllers/favouriteControllers');
const favouriteRouter = express.Router();

favouriteRouter.get('/users/:usersID/favourites', getFavouritesByID)
favouriteRouter.post('/favourites', addFavouriteRecipe)

module.exports = {
    favouriteRouter
}