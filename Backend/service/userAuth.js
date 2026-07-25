const jwt = require("jsonwebtoken")
const secret = "mynameisrajnish"

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email:user.email,
        name:user.name
    }, secret)
}

function getUser(token){
    return jwt.verify(token, secret)
}

module.exports = {
    setUser,
    getUser
}