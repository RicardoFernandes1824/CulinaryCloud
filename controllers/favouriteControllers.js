const prisma = require('../utils/prisma')

const addFavouriteRecipe = async (req, response) => {
    const favouriteRecipe = await prisma.favouriteRecipeUser.create({
        data: {
            recipeID: req.body.recipeID,
            userID: req.body.userID
        }
    })
    console.log("The User " + req.body.userID + "added this recipe as favourite:" + req.body.recipeID)
    response.json("The User " + req.body.userID + "added this recipe as favourite:" + req.body.recipeID)
}

const getFavouritesByID = async (req, response) => {
    const query = req.query;

    let favouriteByUser;
    let receitas;

    if (!req.query.length > 0) {
        favouriteByUser = await prisma.favouriteRecipeUser.findMany({
            where: {
                userID: +req.params.usersID
            },
            select: {
                recipeID: true
            }
        })

        const ids = favouriteByUser.map((favourite) => favourite.recipeID)

        receitas = await prisma.recipe.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    } else {
        const filters = [];

        // Add name filter
        if (query.name) {
            filters.push({
                name: {
                    contains: query.name,
                    mode: "insensitive"
                }
            });
        }

        // Add category filter
        if (query.category) {
            filters.push({
                category: {
                    contains: query.category,
                    mode: "insensitive"
                }
            })
        }

        // Add ingredients filter
        if (query.ingredients) {
            filters.push({
                ingredients: {
                    some: {
                        ingredient: {
                            name: {
                                in: Array.isArray(query.ingredients) ? query.ingredients : [query.ingredients],
                                mode: "insensitive"
                            }
                        }
                    }
                }
            });
        }

        recipes = await prisma.recipe.findMany({
            where: {
                AND: filters
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true
                    }
                }
            }
        })
    }
    response.json(receitas)
}

module.exports = {
    addFavouriteRecipe,
    getFavouritesByID
}