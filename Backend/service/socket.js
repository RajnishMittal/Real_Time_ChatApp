let io;

function setIO(socketIO){
    io = socketIO
    return io
}

function getIO(){
    return io
}

module.exports = { setIO, getIO }