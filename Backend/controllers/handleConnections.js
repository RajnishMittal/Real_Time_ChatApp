const connectionsModel = require("../model/userConnections");
const { getIO } = require("../service/socket");

async function handlePrivate(req, res) {
    const user = req.user._id;
    const { account_type } = req.body;

    try {
        const response = await connectionsModel.findOneAndUpdate(
            { userId: user },
            {
                account_private: account_type
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        );

        return res.status(200).json({
            message: "Success",
            data: response
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update account privacy"
        });
    }
}

async function getStatus(req, res) {
    const userId = req.params.id;

    try {
        const response = await connectionsModel.findOne({
            userId: userId
        });

        return res.status(200).json({
            message: "Success",
            data: response?.account_private ?? false
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to get account privacy"
        });
    }
}


async function myStatus(req, res) {
    const userId = req.user._id;

    try {
        const response = await connectionsModel.findOne({
            userId: userId
        });

        return res.status(200).json({
            message: "Success",
            data: response?.account_private ?? false
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to get account privacy"
        });
    }
}

async function handleReq(req, res) {
    const sendTo = req.params.id
    const sender = req.user._id

    try {
        const response = await connectionsModel
            .findOneAndUpdate({ userId: sendTo }, { $addToSet: { requests: sender } })

        if (!response) {
            return res.status(404).json({
                message: "Person not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Friend Request Sent",
            status: "Pending..."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getRequests(req, res) {
    const user = req.user._id;

    try {
        const response = await connectionsModel
            .findOne({ userId: user })
            .populate("requests", "name bio dob country state username profilePic");

        return res.status(200).json({
            message: "Requests fetched successfully",
            data: response?.requests || []
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch requests"
        });
    }
}


async function acceptRequest(req, res) {
    const user = req.params.id;
    const loggedIn = req.user._id;

    try {
        const response = await connectionsModel.findOneAndUpdate(
            { userId: loggedIn },
            {
                $addToSet: {
                    friends: user
                },
                $pull: {
                    requests: user
                }
            },
            { new: true }
        );

        const response2 = await connectionsModel.findOneAndUpdate(
            { userId: user },
            {
                $addToSet: {
                    friends: loggedIn
                }
            },
            { new: true }
        );

        if (!response || !response2) {
            return res.status(404).json({
                message: "User connection data not found"
            });
        }

        const io = getIO();

        io.to(user.toString()).emit("friend_added");
        io.to(loggedIn.toString()).emit("friend_added");

        res.status(200).json({ message: "friend added successfully" })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" })
    }
}

async function declineRequest(req, res) {
    const user = req.params.id;
    const loggedIn = req.user._id;

    try {
        const response = await connectionsModel.findOneAndUpdate(
            { userId: loggedIn },
            {
                $pull: {
                    requests: user
                }
            },
            { new: true }
        );

        res.status(200).json({ message: "friend request removed successfully" })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" })
    }
}

async function getFriends(req, res) {
    const user = req.user._id

    try {
        const response = await connectionsModel
            .findOne({ userId: user })
            .populate("friends", "name bio dob country state username profilePic");

        return res.status(200).json({
            message: "Requests fetched successfully",
            data: response?.friends || []
        })
    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function getJoinedGroups(req, res) {
    const user = req.user._id
    console.log("friend shld be added")

    try {
        const response = await connectionsModel
            .findOne({ userId: user })
            .populate({
                path: "groupJoined",
                select: "grpName grpBio members admins createdBy grpPic",
                populate: [
                    {
                        path: "members",
                        select: "name username profilePic"
                    },
                ]
            });

        return res.status(200).json({
            message: "Requests fetched successfully",
            data: response?.groupJoined || []
        })
    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}


module.exports = { handlePrivate, getStatus, myStatus, handleReq, getRequests, acceptRequest, declineRequest, getFriends, getJoinedGroups };