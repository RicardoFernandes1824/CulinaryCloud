const prisma = require('../utils/prisma')


const createUpload = async function (req, response) {
    if ((!req.files || Object.keys(req.files).length === 0) && !req.body) {
        return response.status(400).send('No files/tips were uploaded.');
    }
    console.log(req.files)

    if (!req.files) {
        const tips = await prisma.recipeAttachements.create({
            data: {
                recipeId: +req.params.recipeId,
                tips: req.body.tips
            }
        })
        response.json(tips);
        return
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let photo = req.files.sampleFile.name;

    const path = `./attachements/${photo}`

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path, function (err) {
        if (err)
            return response.status(500).send(err);
    });

 
    const newAttachment = await prisma.recipeAttachements.create({
        data: {
            recipeId: +req.params.recipeId,
            path: path
        }
    })
    response.json(newAttachment)
}

module.exports = {
    createUpload
}