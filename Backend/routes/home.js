const express = require("express")
const { allUsers, getme, setMessages, getMessages } = require("../controllers/handleHome")
const upload = require("../middlewares/upload");
const router = express.Router()

router.get("/getusers", allUsers)
router.get("/me", getme)
router.post(
    "/messages",
    upload.single("file"),
    setMessages
);
router.get("/messages/:id", getMessages)

module.exports = router