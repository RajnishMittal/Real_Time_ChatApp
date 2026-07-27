const userModel = require("../model/userModel")

async function setProfile(req, res) {
    try {
        const body = req.body;
        const id = req.params.id;

        const response = await userModel.findByIdAndUpdate(
            id,
            {
                username: body.username,
                dob: body.dob,
                country: body.country,
                state: body.state,
            },
            {
                new: "after",
                runValidators: true,
            }
        );

        if (!response) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(response);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: err.message,
            });
        }

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Username already exists",
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    setProfile
}