const prisma = require('../utils/prisma')

const getIngredients = async (req, response) => {
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
}

const createIngredients = async (req, response) => {
    const newIngredient = await prisma.ingredient.create({
        data: {
            name: req.body.name
        }
    })
    console.log(newIngredient)
    response.json(newIngredient)
}

module.exports = {
    getIngredients,
    createIngredients
}