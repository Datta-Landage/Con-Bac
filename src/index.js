const express = require("express");
const mongoose = require("mongoose");
const route = require("./Routes/route");
const app = express();
const multer = require("multer");
const cors = require("cors");
const cookieSession = require("cookie-session");
app.use(cors());
app.use(multer().any());
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    sameSite: "none",
  })
);
const dotenv = require("dotenv");
dotenv.config()

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })

  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 4000, function () {
  console.log("server app listening on port " + (process.env.PORT || 4000));
});
