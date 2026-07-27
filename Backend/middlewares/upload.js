const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Anchor uploads folder to the project root, not process.cwd()
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Make sure the folder exists (multer won't create it for you)
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;