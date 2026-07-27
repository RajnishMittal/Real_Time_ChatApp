const userModel = require("../model/userModel")
const { setUser } = require("../service/userAuth")

async function handleSignUp(req, res) {
    const body = req.body

    if (!body) return res.status(400).json({ message: "no data" })

    try {
        const response = await userModel.create({
            name: body.name,
            email: body.email,
            pass: body.pass
        })
        return res.status(201).json({ message: "User created successfully" })
    }
    catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: err.message,
            });
        }

        if (err.code === 11000) {
            if (err.keyPattern.email) {
                return res.status(409).json({
                    message: "Email is already registered",
                });
            }
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

async function handleLogin(req, res) {
    const body = req.body;

    try {
        const user = await userModel.findOne({
            email: body.email,
            pass: body.pass
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = setUser(user);
        res.cookie("userCookie", token);

        if (!user.username) {
            return res.status(200).json({
                message: "Profile incomplete",
                needsProfile: true
            });
        }

        return res.status(200).json({
            message: "User logged in",
            needsProfile: false
        });

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: err.message,
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    handleSignUp,
    handleLogin
}