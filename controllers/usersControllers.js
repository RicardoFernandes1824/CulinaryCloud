const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt');

const getAllUsers = async (request, response) => {
    const users = await prisma.user.findMany()
    delete(updateUser.password)
    response.json(users)
}

const createUser = async (req, response) => {
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
};


const updateUser = async (req, response) => {
    const updateUser = await prisma.user.update({
        where: {
            id: +req.params.id //+ transforms the string in Int
        },
        data: req.body,
    })
    delete(updateUser.password) // delete password of the object
    response.json(updateUser)
}

const getUserById = async (req, response) => {
    const userbyID = await prisma.user.findUnique({
        where: {
            id: +req.params.id
        },
    })
    delete(updateUser.password)
    response.json(userbyID)
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    getUserById
}