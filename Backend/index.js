const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const { connectDB } = require("./config/connecton");
const { restrictToLoggedIn } = require("./middlewares/restrictUser");

const userRouter = require("./routes/user");
const homeRouter = require("./routes/home");
const profileRouter = require("./routes/profile");

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
    })

    socket.on("send_message", data => {
        io.to(data.to).emit("receive_message", data.message);
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

server.listen(8000, () => {
    console.log("Server Started");
});