const prisma = require('../utils/prisma')

const addFavouriteRecipe = async (req, response) => {
        const { userId, recipeId } = req.body;
        try {
            const favorite = await prisma.favouriteRecipeUser.create({
                data: {
                    userID: +userId,
                    recipeID: +recipeId,
                },
            });
            response.status(201).json(favorite);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Failed to add favorite' });
        }
    };

const getFavouritesByID = async (req, response) => {
    try {
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
                },
                include:{
                    author: true
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
    } catch (error) {
        console.log(error)
        response.json("Error getting favourite recipes")
    }
}


const deleteFavouritesByID = async (req, response) => {
    const { recipeId } = req.params;
    const { userId } = req.body; 
    try {
        await prisma.favouriteRecipeUser.deleteMany({
            where: {
                recipeID: +recipeId,
                userID: userId,
            },
        });
        response.status(204).send();
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Failed to remove favorite' });
    }
};

module.exports = {
    addFavouriteRecipe,
    getFavouritesByID,
    deleteFavouritesByID
}