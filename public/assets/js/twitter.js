console.log("connected");
var slider = document.getElementById("tweetsrange");
var output = document.getElementById("numoftwtsinput");
var searchtrend = document.getElementById("searchtrend");
var toppostweetstab = document.getElementById("nav-toppostweets");
var topnegtweetstab = document.getElementById("nav-topnegtweets");

output.innerHTML = slider.value;
slider.addEventListener(
  "input",
  () => {
    output.value = slider.value;
  },
  false
);
output.addEventListener("input", () => {
  slider.value = output.value;
});

function runAnalyzer() {
  fetch("/analyze?searchtrend=" + searchtrend.value + "&ntwts=" + slider.value)
    .then(response => response.json())
    .then(jsondata => {
      console.log(jsondata);
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var ptp = jsondata.ptpercentage + 0.5 * jsondata.neutpercentage;
        var ntp = jsondata.ntpercentage + 0.5 * jsondata.neutpercentage;
        var data = google.visualization.arrayToDataTable([
          ["Sentiment", "%tage"],
          ["Positive", parseInt(ptp)],
          ["Negative", parseInt(ntp)]
        ]);

        var options = { title: "Sentiments", width: 600, height: 400 };

        var chart = new google.visualization.PieChart(
          document.getElementById("piechart")
        );
        chart.draw(data, options);
      }
      var postweets = "";
      var negtweets = "";
      var tempt;
      for (var i = 0; i < jsondata.ptweets.length; i++) {
        tempt = jsondata.ptweets[i].text;
        if(tempt.substring(0,2)==="RT"){
          tempt = tempt.substring(3);
        }
        postweets += "" + (i + 1) + ") " + tempt + "<br><br>";
      }
      toppostweetstab.innerHTML = postweets;
      for (var i = 0; i < jsondata.ntweets.length; i++) {
        tempt = jsondata.ntweets[i].text;
        if(tempt.substring(0,2)==="RT"){
          tempt = tempt.substring(3);
        }
        negtweets += "" + (i + 1) + ") " + tempt + "<br><br>";
      }
      topnegtweetstab.innerHTML = negtweets;
      return;
    });
  return false;
}

document.onreadystatechange = function() {
  var state = document.readyState;
  if (state == "complete") {
    setTimeout(function() {
      document.getElementById("interactive");
      document.getElementById("load").style.visibility = "hidden";
    }, 1500);
  }
};
