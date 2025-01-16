const prisma = require('../utils/prisma')
const path = require('path');


const getAllRecipesByUser = async (req, response) => {
    try {
        const userId = +req.params.id; // Assume userId is passed as a parameter

        const getUserRecipes = await prisma.recipe.findMany({
            where: {
                authorId: userId,
            },
            include: {
                ingredients: true, // Include ingredients
                attachements: true, // Include attachments
                author: true, // Include author details
            },
        });

        // Add the isFavorite field to each recipe
        const recipesWithFavorites = await Promise.all(
            getUserRecipes.map(async (recipe) => {
                const isFavorite = await prisma.favouriteRecipeUser.findFirst({
                    where: {
                        recipeID: recipe.id,
                        userID: userId,
                    },
                });
                return {
                    ...recipe,
                    isFavorite: !!isFavorite, // true if found, false otherwise
                };
            })
        );
        response.json(recipesWithFavorites);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
};

const getAllPublicRecipesByUser = async (req, response) => {
    try {
        const getUserRecipes = await prisma.recipe.findMany({
            where: {
                public: true,
                authorId: {
                    not: +req.params.id,  // Exclude the user's own recipes
                },
            }, include: {
                ingredients: true, // Include ingredients
                attachements: true, // Include attachments
                author: true, // Include author details
            },
        });
        response.json(getUserRecipes);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while fetching public recipes' });
    }
};

const getAllRecipes = async (request, response) => {
    try {
        // Get all recipes with the ingredients included
        const query = request.query;

        let recipes;

        const filters = [{
            public: true
        }];

        if (!request.query.length > 0) {
            recipes = await prisma.recipe.findMany({
                where: {
                    AND: filters
                },
                include: {
                    ingredients: {
                        include: {
                            ingredient: true
                        }
                    },
                }
            })
        } else {

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
        // Transform the ingredients array to only have the name and quantity
        /*
        [
                {
                    "id": 1,
                    "recipeId": 1,
                    "ingredientId": 1,
                    "quantity": "10 ml",
                    "ingredient": {
                        "id": 1,
                        "name": "azeite"
                    }
                },
                {
                    "id": 2,
                    "recipeId": 1,
                    "ingredientId": 2,
                    "quantity": "1 embalagem",
                    "ingredient": {
                        "id": 2,
                        "name": "natas"
                    }
                },
                {
                    "id": 3,
                    "recipeId": 1,
                    "ingredientId": 3,
                    "quantity": "500 gramas",
                    "ingredient": {
                        "id": 3,
                        "name": "massa"
                    }
                }
            ]
    
            to
    
            [
                    {
                        "name": "azeite",
                        "quantity": "10 ml"
                    },
                    {
                        "name": "natas",
                        "quantity": "1 embalagem"
                    },
                    {
                        "name": "massa",
                        "quantity": "500 gramas"
                    }
                ]
         */
        recipes.map((recipe) => {
            recipe.ingredients = recipe.ingredients.map((ingredient) => {
                return {
                    name: ingredient.ingredient.name,
                    quantity: ingredient.quantity
                }
            })
        });

        response.json(recipes)
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
}

const createRecipe = async (req, response) => {
    try {
        const ingredientsReceived = req.body.ingredients;
        let coverImage;
        if ((!req.files) && !req.body.coverImage) {
            console.warn("No file was received, defaulting coverImage to empty string")
            coverImage = '';
        } else if (req.files && req.files.sampleFile) {
            console.log("A file was received, saving it to the server")
            const sampleFile = req.files.sampleFile;
            const photo = req.files.sampleFile.name;

            const path = `./attachements/${photo}`

            sampleFile.mv(path, function (err) {
                if (err)
                    return response.status(500).send(err);
            });
            coverImage = photo;

        }
        const newRecipe = await prisma.recipe.create({
            data: {
                name: req.body.name,
                category: req.body.category,
                notes: req.body.notes,
                authorId: +req.body.authorId,
                public: req.body.public === 'true',
                coverImage: coverImage === '' ? '' : coverImage,
                ingredients: {
                    create: JSON.parse(ingredientsReceived).map((ingredient) => {
                        if (ingredient.id) {
                            return {
                                ingredient: {
                                    connect: {
                                        id: ingredient.id
                                    }
                                },
                                quantity: ingredient.quantity
                            };
                        }
                        return {
                            ingredient: {
                                create: {
                                    name: ingredient.name,
                                }
                            },
                            quantity: ingredient.quantity
                        };
                    })

                }

            },
        })
        response.json(newRecipe)
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while creating a recipe' });
    }
}

const updateRecipeByUser = async (req, response) => {
    try {
        let coverImage;
        if (req.files && req.files.sampleFile) {
            const sampleFile = req.files.sampleFile;
            const photo = req.files.sampleFile.name;

            const path = `./attachements/${photo}`

            sampleFile.mv(path, function (err) {
                if (err)
                    return response.status(500).send(err);
            });

            coverImage = path;
        }

        const ingredientsReceived = req.body.ingredients
        
        const updateUserRecipe = await prisma.recipe.update({
            where: {
                id: +req.params.id,
                authorId: +req.params.authorId
            },
            data: {
                name: req.body.name,
                ingredients: {
                    create: JSON.parse(ingredientsReceived).map((ingredient) => {
                        if (ingredient.id) {
                            return {
                                ingredient: {
                                    connect: {
                                        id: ingredient.id
                                    }
                                },
                                quantity: ingredient.quantity
                            };
                        }
                        return {
                            ingredient: {
                                create: {
                                    name: ingredient.name,
                                }
                            },
                            quantity: ingredient.quantity
                        };
                    })

                },
                category: req.body.category,
                notes: req.body.notes,
                public: req.body.public === "true",
                coverImage: coverImage?.split("./attachements/")[1]
            },
        })
        response.json(updateUserRecipe)
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while updating a recipe' });
    }
}

const deleteRecipe = async (req, response) => {
    try {
        const deleteRecipe = await prisma.recipe.delete({
            where: {
                authorId: +req.params.authorId,
                id: +req.params.id
            }
        })

        response.json("Recipe deleted")
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while deleting a recipe' });
    }
}

const getPublicRecipeById = async (req, response) => {
    try {
        console.log(req.params)
        const getUserRecipe = await prisma.recipe.findUnique({
            where: {
                id: +req.params.id,
                public: true
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                attachements: true,
                author: true
            }
        });
        console.log(getUserRecipe)
        response.json(getUserRecipe);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while fetching a recipe' });
    }
};

const getRecipeByUser = async (req, response) => {
    try {
        const getUserRecipe = await prisma.recipe.findUnique({
            where: {
                id: +req.params.id,
                authorId: +req.params.authorId
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                attachements: true,
                author: true
            }
        })
        response.json(getUserRecipe);
    }catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while fetching a recipe' });
    }
}

module.exports = {
    createRecipe,
    updateRecipeByUser,
    getAllPublicRecipesByUser,
    getPublicRecipeById,
    getAllRecipes,
    getAllRecipesByUser,
    getRecipeByUser,
    deleteRecipe
}