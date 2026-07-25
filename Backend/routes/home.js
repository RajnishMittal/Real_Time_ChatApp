const express = require("express")
const {allUsers, getme, setMessages, getMessages} = require("../controllers/handleHome")
const router = express.Router()

router.get("/getusers", allUsers)
router.get("/me", getme)
router.post("/messages", setMessages)
router.get("/messages/:id", getMessages)

module.exports = router