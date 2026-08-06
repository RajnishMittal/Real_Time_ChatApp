const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const { connectDB } = require("./config/connecton");
const { restrictToLoggedIn } = require("./middlewares/restrictUser");

const onlineUsers = require("./service/userStatus");

const userRouter = require("./routes/user");
const userLogout = require("./routes/logout")
const homeRouter = require("./routes/home");
const profileRouter = require("./routes/profile");
const groupRouter = require("./routes/group");

const msgModel = require("./model/msgModel")

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.on("join", userId => {
        socket.join(userId)
        socket.userId = userId;

        if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());

        onlineUsers.get(userId).add(socket.id);

        io.emit("online", { userId, online: true });
    })

    socket.on("join_group_room", grpId => {
        socket.join(grpId)
    })

    socket.on("disconnect", () => {
        if (!socket.userId) return;

        const sockets = onlineUsers.get(socket.userId);

        sockets.delete(socket.id);

        if (sockets.size === 0) {
            onlineUsers.delete(socket.userId);
            io.emit("online", {
                userId: socket.userId,
                online: false
            });
        }
    });

    socket.on("send_message", data => {
        io.to(data.to).emit("receive_message", data.message);
    })

    socket.on("send_group_message", data => {
        socket.to(data.group).emit("receive_group_message", data.message);
    })
});

connectDB()
    .then(() => console.log("MongoDB Connected"))
    .catch(console.error);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/userImage", express.static(path.join(__dirname, "userImage")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", userRouter);
app.use("/api/home", restrictToLoggedIn, homeRouter);
app.use("/api/profile", restrictToLoggedIn, profileRouter);
app.use("/api/group", restrictToLoggedIn, groupRouter);
app.use("/api/logout", restrictToLoggedIn, userLogout)

server.listen(8000, () => {
    console.log("Server Started");
});
