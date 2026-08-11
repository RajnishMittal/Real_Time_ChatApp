const express = require("express")
const { allUsers, getme, setMessages, getMessages, setGroupMessages, getGroupMessages , getAnalytics, handleInfo, getInfo, markAsRead, gettInfo} = require("../controllers/handleHome")
const onlineUsers = require("../service/userStatus");
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
router.post(
    "/group/messages",
    upload.single("file"),
    setGroupMessages
);
router.get("/group/messages/:id", getGroupMessages)
router.get("/analytics", getAnalytics)
router.get("/status/:id", (req, res) => {
    if(onlineUsers.has(req.params.id)) res.status(200).json({_id: req.params.id  ,status: true})
    else res.status(404).json({_id: req.params.id  ,status: false})
})

router
    .post("/userMeta", handleInfo)
    .get("/userMeta", getInfo)
    .get("/userMeta/:id", gettInfo)

router.post("/markRead/:id", markAsRead)

module.exports = router