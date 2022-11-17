const multer = require('multer');
const path = require('path');
const config = require('../config/upload.config');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, config.default.path)
	},
	filename: function (req, file, cb) {
		const parse = path.parse(file.originalname);
		cb(null, parse.name.replace(/\s+/g,'_') + '_' + Date.now() + parse.ext);
	},
});

module.exports = multer({ 
	storage: storage,
	limits: {
        fileSize: config.default.size
    },
});