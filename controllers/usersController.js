const prisma = require('../utils/prisma')

const getAllUsers = async (request, response) => {
    const users = await prisma.user.findMany()
    console.log(users)
    response.json(users)
}

const createUser = async (req, response) => {
    const newUser = await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name
        }
    })
    console.log(newUser)
    response.json(newUser)
}

const updateUser = async (req, response) => {
    const updateUser = await prisma.user.update({
        where: {
            id: +req.params.id //+ transforms the string in Int
        },
        data: req.body
    })
    console.log(updateUser)
    response.json(updateUser)
}

const getUserById = async (req, response) => {
    const userbyID = await prisma.user.findUnique({
        where: {
            id: +req.params.id
        },
    })
    console.log(userbyID)
    response.json(userbyID)
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    getUserById
}