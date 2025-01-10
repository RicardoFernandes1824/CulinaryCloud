const prisma = require('../utils/prisma')
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken')

const login = async (request, response) => {
    const { email, password } = request.body;

    const findUser = await prisma.user.findUnique({
        where: {
            email: email
        }, select: {
            id: true,
            password: true,
            email: true, 
            name: true
        }
    
    })

if (!findUser) {
    return response.sendStatus(401)
}

const validPassword = await bcryt.compare(password, findUser.password);

if (!validPassword) {
    return response.status(403).json({
        message: "Wrong password"
    })
}

const accessToken = jwt.sign(
    { "email": findUser.email, "id": findUser.id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
);

response.json({
    message: "Enjoy your access token!",
    token: accessToken,
    name: findUser.name,
    id: findUser.id
})

}

module.exports = {
    login
}