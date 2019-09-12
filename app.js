require("dotenv").config();
var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/twitteranalysis", (req, res) => {
  res.render("twitter");
});

// for spawn process
// app.get("/analyze", (req, res) => {
//   var text;
//   console.log(req.query.searchtrend);
//   const { spawn } = require("child_process");
//   const pyProg = spawn("python", [
//     "public/assets/pyth.py",
//     req.query.searchtrend,
//     req.query.ntwts
//   ]);

//   pyProg.stdout.on("data", function(data) {
//     text = data.toString();
//     console.log(text);
//     res.json({ text: text });
//   });
// });

app.get("/analyze", (req, res) => {
  var query = req.query.searchtrend;
  var count = req.query.ntwts;

  request(
    process.env.FLASKSERVERURL + "/analyze?query=" + query + "&count=" + count,
    function(err, response, body) {
      if (!err && response.statusCode === 200) {
        tweetsjson = JSON.parse(body);
        console.log(tweetsjson);
        res.json(tweetsjson);
      }
    }
  );
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Server started!!");
});
