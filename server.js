const express = require("express");
const mongoose = require("mongoose"); //#2
const bodyParser = require('body-parser'); //#5

const user = require("./routes/api/user"); //#3
const post = require("./routes/api/post"); //#3
const profile = require("./routes/api/profile"); //#3

const app = express();

//Body parser middleware #5
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// DB Config
const db = require("./config/key").mongoURI; //#2

//connect to mongoDB
mongoose.connect(db)
  .then(() => console.log("success connectfully"))
  .catch((e) => console.log(e)); //#2

app.get("/", (req, res) => res.send("Hello!"));

app.use("/api/users", user); //#3
app.use("/api/profile", profile); //#3
app.use("/api/post", post); //#3

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on PORT ${port}`));
