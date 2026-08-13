const userModel = require("../model/userModel")
const uploadToCloudinary = require("../service/cloudinaryUpload");

async function setProfile(req, res) {
    try {
        const body = req.body;
        const id = req.params.id;

        let imageUrl;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "LinkSync/profiles"
            );

            imageUrl = result.secure_url;
        }

        const response = await userModel.findByIdAndUpdate(
            id,
            {
                username: body.username,
                dob: body.dob,
                country: body.country,
                state: body.state,
                ...(imageUrl ? { profilePic: imageUrl } : {})
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!response) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(response);

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: err.message
            });
        }

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function update_profile(req, res) {
    try {
        const body = req.body;
        const id = req.user._id;

        const update = {
            username: body.username,
            dob: body.dob,
            country: body.country,
            state: body.state
        };

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "LinkSync/profiles"
            );

            update.profilePic = result.secure_url;
        }

        const response = await userModel.findByIdAndUpdate(
            id,
            update,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!response) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            data: response
        });

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: err.message
            });
        }

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    setProfile,
    update_profile
};