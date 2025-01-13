const prisma = require('../utils/prisma')

const getIngredients = async (req, response) => {
    try {
        if (!req.query.name) {
            const ingredients = await prisma.ingredient.findMany()
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
        }
    } catch (error) {
        response.status(400).json({ error: error.message })

    }
}

const createIngredients = async (req, response) => {
    try {
        const newIngredient = await prisma.ingredient.create({
            data: {
                name: req.body.name
            }
        })
        response.json(newIngredient)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
}

module.exports = {
    getIngredients,
    createIngredients
}