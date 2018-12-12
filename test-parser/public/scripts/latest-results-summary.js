var xhttpLatestResultsSummary;
var failed;
var passed;

function populateLastestResultsSummary() {
    xhttpLatestResultsSummary = new XMLHttpRequest();
    xhttpLatestResultsSummary.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            latestResultsSummaryCallbackFunction();
        }
    };
    xhttpLatestResultsSummary.open("GET", "/api/results?latest=true", true);
    xhttpLatestResultsSummary.setRequestHeader("username", username);
    xhttpLatestResultsSummary.send();
}

function latestResultsSummaryCallbackFunction() {
    // Get the results
    var resultSet = JSON.parse(xhttpLatestResultsSummary.responseText);
    var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
    var total = recordsInSet.length;
    // [Re]Set counters
    passed = 0;
    failed = 0;
    var durationHours = 0;
    var durationMinutes = 0;
    var durationSeconds = 0;

    // Parse the results
    for (var i = 0; i < total; i++) {
        var currentRecord = recordsInSet[i];
        if (currentRecord.outcome === "Passed") {
            passed++;
        }
        else if (currentRecord.outcome === "Failed") {
            failed++;
        }
        var duration = currentRecord.duration;
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
    document.getElementById("latestTotal").innerText = total;
    document.getElementById("latestPassed").innerText = passed + passedPercentage;
    document.getElementById("latestFailed").innerText = failed + failedPercentage;
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

populateLastestResultsSummary();