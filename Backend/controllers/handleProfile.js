const userModel = require("../model/userModel")
const path = require("path")

async function setProfile(req, res) {
    try {
        const body = req.body;
        const id = req.params.id;
        const imagePath = req.file
            ? path.join("userImage", req.file.filename).replace(/\\/g, "/")
            : undefined;

        const response = await userModel.findByIdAndUpdate(
            id,
            {
                username: body.username,
                dob: body.dob,
                country: body.country,
                state: body.state,
                profilePic: imagePath ? imagePath : null
            },
            {
                new: true,
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


async function update_profile(req, res) {
    try {
        const body = req.body
        const id = req.user._id

        const updateData = {
            name: body.name,
            bio: body.bio,
            dob: body.dob,
            country: body.country,
            state: body.state,
        };

        if (req.file) {
            updateData.profilePic = path
                .join("userImage", req.file.filename)
                .replace(/\\/g, "/");
        }

        const response = await userModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!response) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ data: response });
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
    setProfile,
    update_profile
};