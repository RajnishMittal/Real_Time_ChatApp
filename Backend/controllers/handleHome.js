const userModel = require("../model/userModel")
const msgModel = require("../model/msgModel")

async function allUsers(req, res) {
    try {
        const allUsers = await userModel.find({})

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
    const body = req.body

    if (!body) return res.status(400).json({ error: "no data" })

    try {
        const response = await msgModel.create({
            sender: body.sender,
            to: body.to,
            text: body.text
        })
        return res.status(201).json({ message: "Message sent successfully", data: response })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
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