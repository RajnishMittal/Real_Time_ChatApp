const express = require("express")
const {
    createGroup,
    allGroups,
    addUser,
    update_group,
    promote_user,
    kick_user,
    demote_User,
    delete_group
} = require("../controllers/handleGroup")
const upload_profPic = require("../middlewares/upload_profPic");
const router = express.Router()

router.post("/createGroup", upload_profPic.single("grpPic"), createGroup)
router.get("/getGroups", allGroups)
router.post("/addUser/:id", addUser)
router.post("/updateGroup/:id", upload_profPic.single("grpPic"), update_group)
router.post("/promoteUser/:id", promote_user)
router.post("/demoteUser/:id", demote_User)
router.post("/removeUser/:id", kick_user)
router.delete("/deleteGroup/:id", delete_group)

module.exports = router