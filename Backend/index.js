const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const {connectDB} = require("./config/connecton")
const {restrictToLoggedIn} = require("./middlewares/restrictUser")
const userRouter = require("./routes/user")
const homeRouter = require("./routes/home")
const profileRouter = require("./routes/profile")
const app = express()
const PORT = 8000

connectDB().then(() => console.log("mongodb is connected!!")).catch(error => console.log(error))

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api", userRouter)
app.use("/api/home", restrictToLoggedIn,  homeRouter)
app.use("/api/profile", restrictToLoggedIn,  profileRouter)

app.listen(PORT, () => console.log("Server Connected"))