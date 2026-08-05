const express = require("express")
const router = express.Router()

router.post("/", (req, res) => {
    res.clearCookie("userCookie")
    res.status(200).json({ status: "Log out successfully" })
})

module.exports = router