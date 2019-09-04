require("dotenv").config();
var express = require("express"),
  app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/twitteranalysis", (req, res) => {
  res.render("twitter");
});

app.get("/analyze", (req, res) => {
  var text;
  console.log(req.query.searchtrend);
  const { spawn } = require("child_process");
  const pyProg = spawn("python", [
    "public/assets/pyth.py",
    req.query.searchtrend,
    req.query.ntwts
  ]);

  pyProg.stdout.on("data", function(data) {
    text = data.toString();
    console.log(text);
    res.json({ text: text });
  });
});
app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Server started!!");
});
