const uploadToCloudinary = require("../service/cloudinaryUpload");
const userModel = require("../model/userModel")
const msgModel = require("../model/msgModel")
const metaModel = require("../model/UserMeta")
const groupModel = require("../model/groupModel");

async function allUsers(req, res) {
    try {
        const allUsers = await userModel.find({
            username: { $ne: null }
        });

        if (!allUsers) {
            return res.status(404).json({ error: "No User Found" })
        }
        res.status(200).json(allUsers)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function getme(req, res) {
    const user_id = req.user._id

    try {
        const userr = await userModel.findOne({
            _id: user_id
        })
        if (!userr) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.status(200).json(userr)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function setMessages(req, res) {
    try {
        let fileData;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "LinkSync/messages"
            );

            fileData = {
                filename: req.file.originalname,
                path: result.secure_url,
                mimetype: req.file.mimetype,
                size: req.file.size
            };
        }

        const response = await msgModel.create({
            sender: req.body.sender,
            to: req.body.to,
            text: req.body.text,
            file: fileData
        });

        await metaModel.findOneAndUpdate(
            { userId: req.body.to },
            {
                $inc: {
                    [`number_of_unreadMsg.${req.body.sender}`]: 1
                },
                $set: {
                    [`lastUnread.${req.body.sender}`]: response
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        return res.status(201).json({
            message: "Message sent successfully",
            data: response
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

async function setGroupMessages(req, res) {
    try {
        let fileData;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "LinkSync/messages"
            );

            fileData = {
                filename: req.file.originalname,
                path: result.secure_url,
                mimetype: req.file.mimetype,
                size: req.file.size
            };
        }

        const response = await msgModel.create({
            sender: req.body.sender,
            text: req.body.text,
            group: req.body.group,
            file: fileData
        });

        await response.populate(
            "sender",
            "name username profilePic"
        );

        const grp = await groupModel
            .findById(req.body.group)
            .select("members");

        if (grp?.members?.length) {
            const bulkOps = grp.members
                .filter(m => m.toString() !== req.body.sender)
                .map(memberId => ({
                    updateOne: {
                        filter: { userId: memberId },
                        update: {
                            $inc: {
                                [`number_of_unreadMsg.${req.body.group}`]: 1
                            },
                            $set: {
                                [`lastUnread.${req.body.group}`]: response
                            }
                        },
                        upsert: true
                    }
                }));

            if (bulkOps.length) {
                await metaModel.bulkWrite(bulkOps);
            }
        }

        return res.status(201).json({
            message: "Message sent successfully",
            data: response
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

async function getMessages(req, res) {
    const sender_id = req.user?._id || req.user
    const to_id = req.params.id

    try {
        const body = await msgModel.find({
            $or: [
                { sender: sender_id, to: to_id },
                { sender: to_id, to: sender_id },
            ],
        }).sort({ createdAt: 1 })

        return res.status(200).json(body)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function getGroupMessages(req, res) {
    const group_id = req.params.id

    try {
        const body = await msgModel
            .find({ group: group_id })
            .sort({ createdAt: 1 })
            .populate("sender", "name username profilePic")

        return res.status(200).json(body)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

async function getAnalytics(req, res) {
    const user_id = req.user._id;

    try {
        const msg_sent = await msgModel.countDocuments({
            sender: user_id,
        });

        const msg_received = await msgModel.countDocuments({
            to: user_id,
        });

        const account_age = await userModel.findOne(
            { _id: user_id },
            { createdAt: 1, _id: 0 }
        );

        return res.status(200).json({
            msg_sent,
            msg_received,
            account_age
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}

async function handleInfo(req, res) {
    try {
        const userId = req.user._id;
        const { unreadCounts, lastUnread } = req.body;
        console.log(unreadCounts, lastUnread)

        const meta = await metaModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    number_of_unreadMsg: unreadCounts || {},
                    lastUnread: lastUnread || {}
                }
            },
            {
                returnDocument: 'after',
                upsert: true
            }
        );

        res.json({
            success: true,
            data: meta
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Failed to save user meta"
        });
    }
};

async function getInfo(req, res) {
    try {
        const userId = req.user._id;

        const meta = await metaModel.findOne({ userId });

        if (!meta) {
            return res.status(200).json({
                success: true,
                data: {
                    userId,
                    lastOnline: null,
                    number_of_unreadMsg: {},
                    lastUnread: {}
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: meta
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch user meta"
        });
    }
}


async function gettInfo(req, res) {
    try {
        const userId = req.params.id;

        if (!userId || userId === "null" || userId === "undefined") {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
        }

        const meta = await metaModel.findOne({ userId });

        if (!meta) {
            return res.status(200).json({
                success: true,
                data: {
                    userId,
                    lastOnline: null,
                    number_of_unreadMsg: {},
                    lastUnread: {}
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: meta
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch user meta"
        });
    }
}

async function markAsRead(req, res) {
    try {
        const userId = req.user._id;
        const contactId = req.params.id;

        await metaModel.findOneAndUpdate(
            { userId },
            {
                $unset: {
                    [`number_of_unreadMsg.${contactId}`]: "",
                    [`lastUnread.${contactId}`]: ""
                }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}


module.exports = {
    allUsers,
    getme,
    setMessages,
    setGroupMessages,
    getMessages,
    getGroupMessages,
    getAnalytics,
    handleInfo,
    getInfo,
    gettInfo,
    markAsRead,
}