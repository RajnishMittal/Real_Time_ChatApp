const userModel = require("../model/userModel")
const {setUser} = require("../service/userAuth")

async function handleSignUp(req, res) {
    const body = req.body

    if (!body) return res.status(400).json({ error: "no data" })

    try {
        const response = await userModel.create({
            name: body.name,
            email: body.email,
            pass: body.pass
        })
        return res.status(201).json({message: "User created successfully"})
    }
    catch(error){
        console.error(error)
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email already exists" })
        }
        return res.status(500).json({ error: "Something went wrong" })
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
            return res.status(404).json({ error: "User not found" });
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

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

module.exports = {
    handleSignUp,
    handleLogin
}