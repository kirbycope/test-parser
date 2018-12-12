var xhttpLiveResultsSummary;

function populateLastestResultsSummary() {
    xhttpLiveResultsSummary = new XMLHttpRequest();
    xhttpLiveResultsSummary.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            liveResultsSummaryCallbackFunction();
        }
    };
    xhttpLiveResultsSummary.open("GET", "/api/live", true);
    xhttpLiveResultsSummary.setRequestHeader("username", username);
    xhttpLiveResultsSummary.send();
}

function liveResultsSummaryCallbackFunction() {
    // Get the results
    var resultSet = JSON.parse(xhttpLiveResultsSummary.responseText);
    var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
    total = recordsInSet.length;
    // [Re]Set counters
    passed = recordsInSet.filter(function (o) { return o.outcome === "Passed"; }).length;
    failed = recordsInSet.filter(function (o) { return o.outcome === "Failed"; }).length;
    // Parse the results for total duration
    parseRecordsInResultSetDuration(recordsInSet);
    // Calculate the times
    calculateTimes();
    // Display the results in a <table>
    updateResultsSummarySpan();
    // Draw the pie chart
    drawChart();
}

populateLastestResultsSummary();
