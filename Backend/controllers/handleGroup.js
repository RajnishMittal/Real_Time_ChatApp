const groupModel = require("../model/groupModel")
const path = require("path");

async function createGroup(req, res) {
    const userId = req.user._id
    const body = req.body
    const imagePath = req.file
        ? path.join("userImage", req.file.filename).replace(/\\/g, "/")
        : undefined;

    console.log(req.body);
    console.log(req.file);

    try {
        const response = await groupModel.create({
            grpName: body.grpName,
            grpPic: imagePath,
            members: [userId],
            createdBy: userId
        })

        return res.status(200).json({ message: "New Group Created" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}

async function allGroups(req, res) {
    try {
        const allGroups = await groupModel
            .find({})
            .populate("createdBy", "name username profilePic _id")
            .populate("members", "name username profilePic _id");

        if (allGroups.length === 0) {
            return res.status(200).json([]);
        }

        if (!allGroups) {
            return res.status(404).json({ error: "No Group Found" })
        }
        res.status(200).json(allGroups)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function addUser(req, res){
    const user = req.user._id
    const grp_id = req.params.id

    try{
        const response = await groupModel.findByIdAndUpdate(grp_id, { $addToSet: { members: user } }, { returnDocument: "after" })
        
        if (!response) {
            return res.status(404).json({ message: "Group not found" });
        }

        return res.status(200).json({message: "new user added"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "server error"})
    }

}

module.exports = {
    createGroup,
    allGroups,
    addUser
}