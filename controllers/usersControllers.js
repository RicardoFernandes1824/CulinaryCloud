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
        const { password, ...updateData } = req.body; // Destructure password and other fields

        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10); // Generate salt
            updateData.password = await bcrypt.hash(password, salt); // Hash and set password
        }

        // Perform the update operation using Prisma
        const updatedUser = await prisma.user.update({
            where: {
                id: +req.params.id, // Convert the ID to an integer
            },
            data: updateData, // Pass the data to update (with or without password)
        });

        // Remove password from the response to ensure it's not exposed
        delete updatedUser.password;

        // Respond with the updated user object
        response.json(updatedUser);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Something went wrong' });
    }
};

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