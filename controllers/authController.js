const usersDB = {
    users: require('../prisma/schema.prisma'), // DEVE ESTAR MAL
    setUsers: function (data) {this.users = data}
}


const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');


const handleLogin = async (req,response) => {
    const { user, password } = req.body;
    if(!user || !password) return response.status(400).json({ 'message': 'Username and password are required!'})
    const foundUser = usersDB.users.find(user === user.name); // nao faço puta ideia
    if(!foundUser) return response.sendStatus(401); //Unauthorized
    //evaluate password
    const match = await bcryt.compare(password, foundUser.password);
    if(match) {
        // Create JWTs
        const accessToken = jwt.sign(
            {"username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s' }
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        const otherUsers = usersDB.users.filter(person??? => person.username????? !== foundUser.username);
        const currentUser = {... foundUser, refreshToken };
        usersDB.setUsers([...otherUsers,currentUser]);
        await fsPromises.writeFile( // Nao faço puta idei do que e isto
            path.join(_dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        response.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}) // milliseconds
        response.json({ accessToken });
    } else {
        response.sendStatus(401);
    }
}

module.exports = {handleLogin};