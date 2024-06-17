//============================ express ================================//

require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
const cors = require("cors")
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/files", express.static("files"))

//============================ auto refresh ===========================//

const path = require("path");
// const livereload = require("livereload");
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname, 'public'));
// const connectLivereload = require("connect-livereload");
// app.use(connectLivereload());

// liveReloadServer.server.once("connection", () => {
//     setTimeout(() => {
//         liveReloadServer.refresh("/");
//     }, 100);
// });

//============================ bodyParser سليم ========================//

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//============================ mongoose ===============================//

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONECT)
    .then(result => {
        app.listen(port, () => {
            console.log(`Example app listening on ${process.env.HTTP}${port}`)
        })
    })
    .catch(err => {
        console.log("err mongoose : ", err);
    });


//============================ Passport ===============================//

// const passport = require("passport")
// const passportSetup = require("./passport/passport")
// const cookieSession = require("cookie-session")
// app.use(
//     cookieSession({
//         name:"session",
//         keys:["cyberwolve"],
//         maxAge:24*60*60*100,
//     })
// )
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(
//     cors({
//         origin:'http://localhost:3000',
//         methods:'GET,POST,PUT,DELETE',
//         credentials:true,
//     })
// )

//============================ Routes =================================//

const { protectAdmin, protectAll } = require('./validators/protect')

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname + "/treaning-front-main/build/index.html"));
// });

app.use("/auth", require("./routes/authuser"))
app.use("/clineArticales", require("./routes/ClineRoutes/ClineArticales"))
app.use("/users",protectAll, require("./routes/users"))
app.use("/card",protectAll, require("./routes/card"))
app.use("/support", protectAll,require("./routes/support"))
app.use("/articales",protectAdmin, require("./routes/Articales"))


app.use((req, res, next) => {
    res.status(404).send("لا يمكن الوصول للصفحة")
})






