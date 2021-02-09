const multer = require('multer');
const { type } = require('os');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = path.parse(file.originalname).name.split(' ').join('_');
        //ancien code:    console.log(file.originalname+'-'+name);
        const extension = MIME_TYPES[file.mimetype];
        if (typeof extension !== 'undefined') {
            callback(null, name + Date.now() + '.' + extension);
        }
        else {
            
            //console.log('Type non valide');
            throw (req, res, callback) => res.status(400).json({ error: 'Type de fichier non valide !' }); 
            callback(null, false);
        }
    }
});


module.exports = multer({ storage } ).single('image');