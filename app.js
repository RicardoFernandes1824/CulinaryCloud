const express = require('express');
const cors = require('cors');
const { ingredientsRouter } = require('./routes/ingredients');
const { usersRouter } = require('./routes/users');
const { recipeRouter } = require('./routes/recipe');
const { uploadsRouter } = require('./routes/uploads');
const { favouriteRouter } = require('./routes/favourites');
const { accountRouter } = require('./routes/authentication');
const fileUpload = require('express-fileupload');
const path = require('path');

const verifyJWT = require('./middleware/verifyJWT');

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(fileUpload())
app.use(cors())


app.use(accountRouter)
app.use('/static', express.static(path.join(__dirname, './attachements')));
app.use(verifyJWT);

app.use(usersRouter)

app.use(ingredientsRouter);

app.use(recipeRouter)

app.use(favouriteRouter)

app.use(uploadsRouter)



app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});