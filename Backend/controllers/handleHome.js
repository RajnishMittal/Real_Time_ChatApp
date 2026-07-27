const path = require("path");
const userModel = require("../model/userModel")
const msgModel = require("../model/msgModel")

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

function getme(req, res) {
    const userr = req.user

    if (!userr) {
        return res.status(404).json({ error: "User not found" })
    }

    return res.status(200).json(userr)
}

async function setMessages(req, res) {
    try {
        const filePath = req.file
            ? path.join("uploads", req.file.filename).replace(/\\/g, "/")
            : undefined;

        const response = await msgModel.create({
            sender: req.body.sender,
            to: req.body.to,
            text: req.body.text,
            file: req.file
                ? {
                    filename: req.file.filename,
                    path: filePath,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                }
                : undefined,
        });

        return res.status(201).json({
            message: "Message sent successfully",
            data: response,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Something went wrong",
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

module.exports = {
    allUsers,
    getme,
    setMessages,
    getMessages
}