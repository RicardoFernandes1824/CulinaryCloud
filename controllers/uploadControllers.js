const prisma = require('../utils/prisma')


const createUpload = async function (req, response) {
    try {
        console.log("Attempting to save files or tips")
        if ((!req.files || Object.keys(req.files).length === 0) && !req.body) {
            return response.status(400).send('No files/tips were uploaded.');
        }

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

        const files = req.files.sampleFile;

        if (files.length > 0) {
            files.forEach(async file => {
                let sampleFile = file;
                let photo = file.name;

                const path = `./attachements/${photo}`

                // Use the mv() method to place the file somewhere on your server
                sampleFile.mv(path, function (err) {
                    if (err)
                        return response.status(500).send(err);
                });

                const newAttachment = await prisma.recipeAttachements.create({
                    data: {
                        recipeId: +req.params.recipeId,
                        path: photo
                    }
                })

                console.log('New attachment created: ', newAttachment)
            });
        }
        return response.json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.log('Error: ', error)
        return response.status(500).send('An error occured while uploading files');
    }
}

module.exports = {
    createUpload
}