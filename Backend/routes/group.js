const express = require("express")
const {createGroup, allGroups, addUser} = require("../controllers/handleGroup")
const upload_profPic = require("../middlewares/upload_profPic");
const router = express.Router()

router.post("/createGroup", upload_profPic.single("grpPic") , createGroup)
router.get("/getGroups", allGroups)
router.post("/addUser/:id", addUser)

module.exports = router