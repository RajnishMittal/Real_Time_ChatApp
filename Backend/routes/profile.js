const express = require("express")
const {setProfile, update_profile } = require("../controllers/handleProfile")
const upload_profPic = require("../middlewares/upload_profPic")
const router = express.Router()

router.post(
    "/update",
    upload_profPic.single("image"),
    update_profile
);

router.post(
    "/:id",
    upload_profPic.single("image"),
    setProfile
);

module.exports = router