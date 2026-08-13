const multer = require("multer");

const storage = multer.memoryStorage();

const upload_profPic = multer({
    storage
});

module.exports = upload_profPic;