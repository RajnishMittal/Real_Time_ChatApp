const {getUser} = require("../service/userAuth")

function restrictToLoggedIn(req, res, next) {
    try {
        const token = req.cookies?.userCookie
        if (!token) {
            res.setHeader("Cache-Control", "no-store")
            return res.status(401).json({ error: "Not authenticated" })
        }

        const user = getUser(token)
        req.user = user
        res.setHeader("Cache-Control", "no-store")
        next()
    } catch (err) {
        return res.status(401).json({ error: "Not authenticated" })
    }
}

module.exports = {
    restrictToLoggedIn
} 