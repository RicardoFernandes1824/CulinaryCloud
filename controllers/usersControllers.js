const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt');

const getAllUsers = async (request, response) => {
    try {
        const users = await prisma.user.findMany()
        delete (updateUser.password)
        response.json(users)
    } catch (error) {
        response.status(500).json({ error: 'Something went wrong' })
    }
}

const createUser = async (req, response) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            }
        })
        console.log(newUser)
        response.status(201).json({
            message: 'Registration successful', user: {
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'Something went wrong' })
    }
};


const updateUser = async (req, response) => {
    try {
        const updateUser = await prisma.user.update({
            where: {
                id: +req.params.id //+ transforms the string in Int
            },
            data: req.body,
        })
        delete (updateUser.password) // delete password of the object
        response.json(updateUser)
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'Something went wrong' })
    }
}

const getUserById = async (req, response) => {
    try {
        const userbyID = await prisma.user.findUnique({
            where: {
                id: +req.params.id
            },
        })
        delete (updateUser.password)
        response.json(userbyID)
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'Something went wrong' })
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    getUserById
}