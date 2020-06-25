const multer = require('multer');
const {v4 :uuidv4} =require('uuid');
const path = require('path');

const storage =multer.diskStorage({
    destination:'uploads/tiendas',
    filename(req, file, callback) {
        callback(null,uuidv4() + path.extname(file.originalname) )
    }
})
module.exports = multer({storage});
