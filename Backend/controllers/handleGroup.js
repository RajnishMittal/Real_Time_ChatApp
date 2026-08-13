const { group } = require("console");
const groupModel = require("../model/groupModel")
const connectionsModel = require("../model/userConnections")
const uploadToCloudinary = require("../service/cloudinaryUpload");

async function createGroup(req, res) {
    const userId = req.user._id;
    const body = req.body;

    let imageUrl;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            "LinkSync/groups"
        );

        imageUrl = result.secure_url;
    }

    try {
        const response = await groupModel.create({
            grpName: body.grpName,
            grpPic: imageUrl,
            members: [userId],
            admins: [userId],
            createdBy: userId
        });

        await connectionsModel.findOneAndUpdate(
            { userId: userId },
            {
                $addToSet: {
                    groupJoined: response._id
                }
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return res.status(200).json({
            message: "New Group Created"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function allGroups(req, res) {
    try {
        const allGroups = await groupModel
            .find({})
            .populate("createdBy", "name username profilePic _id")
            .populate("members", "name username profilePic _id")
            .populate("admins", "name username profilePic _id");

        if (allGroups.length === 0) {
            return res.status(200).json([]);
        }

        if (!allGroups) {
            return res.status(404).json({ error: "No Group Found" })
        }
        res.status(200).json(allGroups)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function addUser(req, res) {
    const user = req.user._id;
    const grp_id = req.params.id;

    try {
        const response = await groupModel.findByIdAndUpdate(
            grp_id,
            {
                $addToSet: {
                    members: user
                }
            },
            {
                returnDocument: 'after'
            }
        );

        if (!response) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        const response2 = await connectionsModel.findOneAndUpdate(
            { userId: user },
            {
                $addToSet: {
                    groupJoined: grp_id
                }
            },
            {
                returnDocument: 'after',
                upsert: true
            }
        );

        console.log("GROUP CONNECTION:", response2);

        return res.status(200).json({
            message: "New user added",
            data: response2
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function update_group(req, res) {
    const groupId = req.params.id;

    try {

        let imageUrl;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "LinkSync/groups"
            );

            imageUrl = result.secure_url;
        }

        const response = await groupModel
            .findByIdAndUpdate(
                groupId,
                {
                    grpName: req.body.grpName,
                    grpBio: req.body.bio,
                    ...(imageUrl && { grpPic: imageUrl })
                },
                {
                    returnDocument: 'after',
                    runValidators: true
                }
            )
            .populate("createdBy", "name username profilePic _id")
            .populate("members", "name username profilePic _id")
            .populate("admins", "name username profilePic _id");

        if (!response) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        return res.status(200).json({
            data: response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function promote_user(req, res) {
    const groupId = req.params.id;
    const { userId } = req.body;

    try {
        const response = await groupModel
            .findByIdAndUpdate(
                groupId,
                {
                    $addToSet: {
                        admins: userId
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            .populate("createdBy", "name username profilePic _id")
            .populate("members", "name username profilePic _id")
            .populate("admins", "name username profilePic _id");

        if (!response) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        return res.status(200).json({
            data: response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



async function kick_user(req, res) {
    const groupId = req.params.id;
    const { userId } = req.body;

    try {

        const group = await groupModel.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        if (group.createdBy.toString() === userId) {
            return res.status(400).json({
                message: "Creator cannot be removed."
            });
        }

        const response = await groupModel
            .findByIdAndUpdate(
                groupId,
                {
                    $pull: {
                        admins: userId,
                        members: userId
                    }
                },
                {
                    new: true
                }
            )
            .populate("createdBy", "name username profilePic _id")
            .populate("members", "name username profilePic _id")
            .populate("admins", "name username profilePic _id");

        return res.status(200).json({
            data: response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function demote_User(req, res) {
    const groupId = req.params.id;
    const { userId } = req.body;

    try {

        const group = await groupModel.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        if (group.createdBy.toString() === userId) {
            return res.status(400).json({
                message: "Creator cannot be demoted."
            });
        }

        const response = await groupModel
            .findByIdAndUpdate(
                groupId,
                {
                    $pull: {
                        admins: userId
                    }
                },
                {
                    new: true
                }
            )
            .populate("createdBy", "name username profilePic _id")
            .populate("members", "name username profilePic _id")
            .populate("admins", "name username profilePic _id");

        return res.status(200).json({
            data: response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function delete_group(req, res) {
    const groupId = req.params.id;

    try {

        const response = await groupModel.findByIdAndDelete(groupId);

        if (!response) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        return res.status(200).json({
            message: "Group deleted successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createGroup,
    allGroups,
    addUser,
    update_group,
    promote_user,
    kick_user,
    demote_User,
    delete_group
}