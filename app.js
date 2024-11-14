const express = require('express');
const { PrismaClient, Prisma } = require('@prisma/client')
const app = express ();
app.use(express.json());
const prisma = new PrismaClient()


const port = process.env.PORT || 8080;


app.get("/status", (request, response) => {


     const status = {
        "Status": "Running"
     };
     
     response.send(status);
});

app.get("/recipe", async (request, response) => {
    const receitas = await prisma.recipe.findMany()
    console.log(receitas)
    response.json(receitas)   
});

app.post("/recipe", async (request, response) => {
    const receitas = await prisma.recipe.create({
        data: {
            title: 'Arroz',
            ingredients: 'Arroz, Chocolate, Banana',
          },
    })
    console.log(receitas)
    response.json(receitas)   
});


app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});


