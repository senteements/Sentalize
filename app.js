require("dotenv").config();
var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express();

var seeds = require("./seeds.js");

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

app.get("/analyze", (req, res) => {
  var query = req.query.searchtrend;
  var count = req.query.ntwts;

  request(
    process.env.FLASKSERVERURL + "/analyze?query=" + query + "&count=" + count,
    function(err, response, body) {
      if (!err && response.statusCode === 200) {
        var tweetsAnalysis = JSON.parse(body);
        console.log(tweetsAnalysis);
        res.json(tweetsAnalysis);
      }
    }
  );

  // to get data from the seeds file for testing purposes
  // var tweetAnalysis = seeds;
  // res.json(tweetAnalysis);
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Server started!!");
});
