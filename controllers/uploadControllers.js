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

const updateUpload = async function (req, response) {
    try {
        console.log("Updating files for a recipe...");

        const recipeId = +req.params.recipeId;

        // Handle file deletions
        if (req.body.deleteFiles) {
            const filesToDelete = req.body.deleteFiles; // Array of filenames or IDs

            for (const file of filesToDelete) {
                // Find file in the database
                const attachment = await prisma.recipeAttachements.findFirst({
                    where: {
                        recipeId,
                        path: file
                    }
                });

                if (attachment) {
                    // Delete the file from the server
                    const filePath = `./attachements/${attachment.path}`;
                    const fs = require('fs');
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Failed to delete file: ${filePath}`, err);
                    });

                    // Remove from the database
                    await prisma.recipeAttachements.delete({
                        where: {
                            id: attachment.id
                        }
                    });

                    console.log(`Deleted file: ${filePath}`);
                }
            }
        }

        // Handle new file uploads
        if (req.files && req.files.sampleFile) {
            const files = req.files.sampleFile;

            if (!Array.isArray(files)) {
                files = [files]; // Normalize to array if a single file is uploaded
            }

            for (const file of files) {
                const photo = file.name;
                const path = `./attachements/${photo}`;

                // Save the file to the server
                file.mv(path, function (err) {
                    if (err) {
                        return response.status(500).send(`Failed to upload file: ${photo}`);
                    }
                });

                // Save file information in the database
                await prisma.recipeAttachements.create({
                    data: {
                        recipeId,
                        path: photo
                    }
                });

                console.log(`Uploaded new file: ${photo}`);
            }
        }

        return response.json({ message: 'Files updated successfully' });
    } catch (error) {
        console.error('Error updating files:', error);
        return response.status(500).send('An error occurred while updating files.');
    }
};

module.exports = {
    createUpload,
    updateUpload
}