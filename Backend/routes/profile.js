const express = require("express")
const {setProfile} = require("../controllers/handleProfile")
const router = express.Router()

router.post("/:id", setProfile)

module.exports = router