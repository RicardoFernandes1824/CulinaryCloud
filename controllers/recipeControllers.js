const prisma = require('../utils/prisma')
const path = require('path');


const getAllRecipesByUser = async (req, response) => {
    try {
        const getUserRecipes = await prisma.recipe.findMany({
            where: {
                authorId: +req.params.id, 
            },
        });
        response.json(getUserRecipes); 
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
};

const getAllRecipes = async (request, response) => {
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
                }
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
}

const createRecipe = async (req, response) => {
    const ingredients = req.body.ingredients;
    let coverImage;

    if ((!req.files || Object.keys(req.files).length === 0) && !req.body.coverImage) {
        coverImage = 'https://st3.depositphotos.com/13324256/17303/i/450/depositphotos_173034766-stock-photo-woman-writing-down-recipe.jpg';
    } else if (req.files && req.files.sampleFile) {
        const sampleFile = req.files.sampleFile;
        const photo = req.files.sampleFile.name;

        const path = `./attachements/${photo}`

        sampleFile.mv(path, function (err) {
            if (err)
                return response.status(500).send(err);
        });

        coverImage = path;
    }

    const newRecipe = await prisma.recipe.create({
        data: {
            name: req.body.name,
            category: req.body.category,
            notes: req.body.notes,
            authorId: req.body.authorId,
            public: req.body.public,
            coverImage: coverImage.split("./attachements/")[1],
            ingredients: {
                create: ingredients.map((ingredient) => {
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
}

const updateRecipeByUser = async (req, response) => {
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

    const updateUserRecipe = await prisma.recipe.update({
        where: {
            id: +req.params.id,
            authorId: +req.params.authorId
        },
        data: {
            name: req.body.name,
            ingredients: req.body.ingredients,
            category: req.body.category,
            notes: req.body.notes,
            public: req.body.public,
            coverImage: coverImage.split("./attachements/")[1]
        },
    })
    response.json(updateUserRecipe)
}

const deleteRecipe = async (req, response) => {
    const deleteRecipe = await prisma.recipe.delete({
        where: {
            authorId: +req.params.authorId,
            id: +req.params.id
        }
    })

    response.json("Recipe deleted")
}

module.exports = {
    createRecipe,
    updateRecipeByUser,
    getAllRecipes,
    getAllRecipesByUser,
    deleteRecipe
}