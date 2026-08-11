const express = require("express")
const router = express.Router()
const {handlePrivate, getStatus, myStatus, handleReq, getRequests, acceptRequest, declineRequest, getFriends, getJoinedGroups} = require("../controllers/handleConnections")

router.post("/privateConnection", handlePrivate)
router.get("/privateConnection/:id", getStatus)
router.get("/myPrivacy", myStatus)
router.post("/sendRequest/:id", handleReq)
router.get("/sendRequest", getRequests)
router.get("/friends", getFriends)
router.get("/joinedGroups", getJoinedGroups)
router.post("/acceptRequest/:id", acceptRequest)
router.post("/declineRequest/:id", declineRequest)

module.exports = router