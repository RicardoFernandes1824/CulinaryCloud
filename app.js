const express = require('express');
const { PrismaClient, Prisma } = require('@prisma/client')
const app = express();
const fileUpload = require('express-fileupload');
const prisma = new PrismaClient()
app.use(express.json());
app.use(fileUpload());
const verifyJWT = require('./middleware/verifyJWT');
const bcryt = require('bcrypt');


const port = process.env.PORT || 8080;

app.post("/login", async (request, response) => {
    const { email, password } = request.body;

    const findUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!findUser) {
        return response.sendStatus(401)
    }

    const validPassword = await bcryt.compare(password, findUser.password);

    if(!validPassword) {
        return response.sendStatus(403)
    }

    const accessToken = jwt.sign(
        {"username": findUser.email, "id": finduser.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    response.json({
        message: "Enjoy your access token!",
        token: accessToken
    })

})


// Return All Users
app.get("/users", async (request, response) => {
    const users = await prisma.user.findMany()
    console.log(users)
    response.json(users)
});

// Return  User by ID
app.get("/users/:id", async (req, response) => {
    const userbyID = await prisma.user.findUnique({
        where: {
            id: +req.params.id
        },
    })
    console.log(userbyID)
    response.json(userbyID)
});

// Create User + return camps
app.post("/users", async (req, response) => {
    const newUser = await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name
        }
    })
    console.log(newUser)
    response.json(newUser)
});

// Update user by ID
app.patch("/users/:id", async (req, response) => {
    const updateUser = await prisma.user.update({
        where: {
            id: +req.params.id //+ transforms the string in Int
        },
        data: req.body
    })
    console.log(updateUser)
    response.json(updateUser)
});

// Create Ingredient + return newIngredient
app.post("/ingredients", async (req, response) => {
    const newIngredient = await prisma.ingredient.create({
        data: {
            name: req.body.name
        }
    })
    console.log(newIngredient)
    response.json(newIngredient)
})

// Return All Ingredients or by Name Query
app.get("/ingredients", async (req, response) => {
    if (!req.query.name) {
        const ingredients = await prisma.ingredient.findMany()
        console.log(ingredients)
        response.json(ingredients)
    } else {
        const searchIngredients = await prisma.ingredient.findMany({
            where: {
                name: {
                    contains: req.query.name,
                    mode: 'insensitive'
                }
            }
        })
        response.json(searchIngredients)
        console.log(searchIngredients)
    }
});

// test get all or one recipe by UserID
app.get("/users/:id/recipe", async (req, response) => {
    const getUserRecipes = await prisma.recipe.findMany({
        where: {
            authorId: +req.params.id
        },
    })
    console.log(getUserRecipes)
    response.json(getUserRecipes)
});

// test update recipe by UserID            
app.patch("/users/:authorID/recipe/:recipeID", async (req, response) => {
    const updateUserRecipe = await prisma.recipe.update({
        where: {
            recipeID: +req.params.id,
            authorID: +req.params.authorId
        },
        data: {
            name: req.body.name,
            ingredients: req.body.ingredients,
            category: req.body.category,
            notes: req.body.notes,
        },
    })
    console.log(updateUserRecipe)
    response.json(updateUserRecipe)
});

// Return all recipes
app.get("/recipe", async (request, response) => {
    // Get all recipes with the ingredients included
    const query = request.query;

    console.log(query)

    let recipes;

    const filters = [{
        public: true
    }];



    if (!request.query) {
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

    console.log(recipes)
    response.json(recipes)
});

// testar Create Recipe + Return Camps
app.post("/recipe", async (req, response) => {
    const ingredients = req.body.ingredients;
    const newRecipe = await prisma.recipe.create({
        data: {
            name: req.body.name,
            category: req.body.category,
            notes: req.body.notes,
            authorId: req.body.authorId,
            public: req.body.public,
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
    console.log(newRecipe)
    response.json(newRecipe)
});

// ADD favouriteRecipes
app.post("/favourites", async (req, response) => {
    const favouriteRecipe = await prisma.favouriteRecipeUser.create({
        data: {
            recipeID: req.body.recipeID,
            userID: req.body.userID // alterar eventualmente para o token 
        }
    })
    console.log("The User " + req.body.userID + "added this recipe as favourite:" + req.body.recipeID)
    response.json("The User " + req.body.userID + "added this recipe as favourite:" + req.body.recipeID)
});


app.get("/users/:usersID/favourites", async (req, response) => {
    const query = req.query;
    console.log(query)

    let favouriteByUser;
    let receitas;

    if (!req.query) {
        favouriteByUser = await prisma.favouriteRecipeUser.findMany({
            where: {
                userID: +req.params.userID
            },
            select: {
                recipeID: true
            }
        })

        console.log(favouriteByUser)

        const ids = favouriteByUser.map((favourite) => favourite.recipeID)

        console.log(ids)

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
    console.log(receitas)
    response.json(receitas)
})


app.delete("/users/:userId/recipe/:recipeId", async (req, response) => {
    const deleteRecipe = await prisma.recipe.delete({
        where: {
            authorId: +req.params.userId,
            id: +req.params.recipeId
        }
    })

    console.log("Recipe deleted: " + deleteRecipe)
    response.json("Recipe deleted: " + deleteRecipe)
})


app.post('/upload/:recipeId', async function (req, response) {
    if ((!req.files || Object.keys(req.files).length === 0) && !req.body) {
        return response.status(400).send('No files/tips were uploaded.');
    }

    if (!req.files) {
        const tips = await prisma.recipeAttachements.create({
            data: {
                recipeId: +req.params.recipeId,
                tips: req.body.tips
            }
        })
        response.json(tips);
        return
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let photo = req.files.sampleFile.name;

    const path = `./attachements/${photo}`

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path, function (err) {
        if (err)
            return response.status(500).send(err);
    });

 
    const newAttachment = await prisma.recipeAttachements.create({
        data: {
            recipeId: +req.params.recipeId,
            path: path
        }
    })
    response.json(newAttachment)
})

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});