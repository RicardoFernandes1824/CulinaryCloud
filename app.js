const express = require('express');
const { ingredientsRouter } = require('./routes/ingredients');
const { usersRouter } = require('./routes/users');
const { recipeRouter } = require('./routes/recipe');
const { uploadsRouter } = require('./routes/uploads');
const { favouriteRouter } = require('./routes/favourites');
const { accountRouter } = require('./routes/authentication');
const fileUpload = require('express-fileupload');

const verifyJWT = require('./middleware/verifyJWT');

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(fileUpload())


app.use(accountRouter)
app.use(verifyJWT);

app.use(usersRouter)

app.use(ingredientsRouter);

app.use(recipeRouter)

app.use(favouriteRouter)

app.use(uploadsRouter)

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});