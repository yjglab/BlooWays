const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");
const hpp = require("hpp");
const helmet = require("helmet");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const webSocket = require("./socket");
const apiRouter = require("./routes/api");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.set("PORT", process.env.PORT || 4094);
sequelize
  .sync()
  .then(() => {
    console.log("✅ DB CONNECTED");
  })
  .catch(console.error);
passportConfig();
const production = process.env.NODE_ENV === "production";

if (production) {
  app.enable("trust proxy");
  app.use(morgan("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: true,
    credentials: true,
    webSocket: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  proxy: process.env.NODE_ENV === "production",
  cookie: {
    httpOnly: true,
  },
};
if (production) {
  sessionOption.cookie.secure = true;
  sessionOption.cookie.proxy = true;
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", apiRouter);
app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(app.get("PORT"), () => {
  console.log(`PORT LISTENING ${app.get("PORT")}`);
});

webSocket(server, app);
