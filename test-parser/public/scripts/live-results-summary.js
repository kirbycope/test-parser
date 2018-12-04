var xhttpLiveSummary;
var failed;
var passed;

function populateLiveResultsSummary() {
    xhttpLiveSummary = new XMLHttpRequest();
    xhttpLiveSummary.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            liveSummaryCallbackFunction();
        }
    };
    xhttpLiveSummary.open("GET", "/api/liveresults", true);
    xhttpLiveSummary.setRequestHeader("user", user);
    xhttpLiveSummary.send();
}

function liveSummaryCallbackFunction() {
    // Get the results
    var responseObject = JSON.parse(xhttpLiveSummary.responseText);
    var total = responseObject.length;
    passed = 0;
    failed = 0;
    
    var durationHours = 0;
    var durationMinutes = 0;
    var durationSeconds = 0;
    // Parse the results
    for (var i = 0; i < total; i++) {
        if (responseObject[i].outcome === "Passed") {
            passed++;
        }
        else if (responseObject[i].outcome === "Failed") {
            failed++;
        }
        var duration = responseObject[i].duration;
        durationHours += parseInt(duration.substring(0, duration.indexOf(":")));
        durationMinutes += parseInt(duration.substring(duration.indexOf(":") + 1, duration.lastIndexOf(":")));
        durationSeconds += parseInt(duration.substring(duration.lastIndexOf(":") + 1, duration.indexOf("."))); 
    }
    var minutesAsSeconds = durationMinutes * 60;
    var hoursAsSeconds = (durationHours * 60) * 60;
    var totalSeconds = minutesAsSeconds + hoursAsSeconds + durationSeconds;
    var date = new Date(null);
    date.setSeconds(totalSeconds);
    var passedPercentage = " (" + ((passed / total) * 100).toString().substring(0, 4) + "%)";
    var failedPercentage = " (" + ((failed / total) * 100).toString().substring(0, 4)  + "%)";
    // Display the results
    drawChart();
    document.getElementById("liveTotal").innerText = total;
    document.getElementById("livePassed").innerText = passed + passedPercentage;
    document.getElementById("liveFailed").innerText = failed + failedPercentage;
    document.getElementById("duration").innerText = date.toISOString().substr(11, 8);
}

function drawChart() {
    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    passed,
                    failed
                ],
                backgroundColor: [
                    '#d4edda',
                    '#f8d7da'
                ]
            }],
            labels: [
                'Passed',
                'Failed'
            ]
        },
        options: {
            responsive: true
        }
    };
    var ctx = document.getElementById('chart-area').getContext('2d');
    window.myPie = new Chart(ctx, config);
}

populateLiveResultsSummary(drawChart);