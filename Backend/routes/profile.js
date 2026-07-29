const express = require("express")
const {setProfile} = require("../controllers/handleProfile")
const upload_profPic = require("../middlewares/upload_profPic")
const router = express.Router()

router.post("/:id",
    upload_profPic.single("image")
    , setProfile)

module.exports = router