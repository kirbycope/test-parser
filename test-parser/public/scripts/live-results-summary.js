var xhttpLiveSummary;

function populateLiveResultsSummary() {
    xhttpLiveSummary = new XMLHttpRequest();
    xhttpLiveSummary.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            liveSummaryCallbackFunction();
        }
    };
    xhttpLiveSummary.open("GET", "../api/liveresults", true);
    xhttpLiveSummary.send();
}

function liveSummaryCallbackFunction() {
    // Get the results
    var responseObject = JSON.parse(xhttpLiveSummary.responseText);
    var total = responseObject.length;
    var passed = 0;
    var failed = 0;
    var durationHours = 0;
    var durationMinutes = 0;
    var durationSeconds = 0;
    // Parse the results
    for (var i = 0; i < total; i++) {
        if (responseObject[i].outcome === "Passed") {
            passed++;
        }
        else if (responseObject[i].outcome === "Passed") {
            failed++;
        }
        var duration = responseObject[i].duration;
        durationHours += parseInt(duration.substring(0, duration.indexOf(":")));
        durationMinutes += parseInt(duration.substring(duration.indexOf(":") + 1, duration.lastIndexOf(":") - 1));
        durationSeconds += parseInt(duration.substring(duration.lastIndexOf(":") + 1, duration.indexOf(".")));
    }
    var minutesAsSeconds = durationMinutes * 60;
    var hoursAsSeconds = (durationHours * 60) * 60;
    var totalSeconds = minutesAsSeconds + hoursAsSeconds + durationSeconds;
    var date = new Date(null);
    date.setSeconds(totalSeconds);
    // Display the results
    document.getElementById("liveTotal").innerText = total;
    document.getElementById("livePassed").innerText = passed;
    document.getElementById("liveFailed").innerText = failed;
    document.getElementById("duration").innerText = date.toISOString().substr(11, 8);
}

populateLiveResultsSummary();