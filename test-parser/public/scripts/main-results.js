var actualDuration;
var durationHours;
var durationMinutes;
var durationSeconds;
var endDate;
var failed;
var failedPercentage;
var passed;
var passedPercentage;
var resultsList;
var total;
var totalDuration;
var statDate;

function calculateTimes() {
    // Actual Duration
    actualDuration = parseInt((endDate.getTime() - startDate.getTime()) / 1000);
    // Total Duration
    var minutesAsSeconds = durationMinutes * 60;
    var hoursAsSeconds = (durationHours * 60) * 60;
    var totalSeconds = minutesAsSeconds + hoursAsSeconds + durationSeconds;
    totalDuration = new Date(null);
    totalDuration.setSeconds(totalSeconds);
    // Pass/Fail percentages
    passedPercentage = " (" + ((passed / total) * 100).toString().substring(0, 4) + "%)";
    failedPercentage = " (" + ((failed / total) * 100).toString().substring(0, 4) + "%)";
}

function deleteAllLive() {
    var xhttpDeleteLive = new XMLHttpRequest();
    xhttpDeleteLive.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location = "/app/dashboard";
        }
    };
    xhttpDeleteLive.open("DELETE", "/api/live", true);
    xhttpDeleteLive.setRequestHeader("username", username);
    xhttpDeleteLive.send();
    return false;
}

function deleteResults(unixtimestamp) {
    var xhttpDeleteResults = new XMLHttpRequest();
    xhttpDeleteResults.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location = "/app/dashboard";
        }
    };
    xhttpDeleteResults.open("DELETE", "/api/results/" + unixtimestamp, true);
    xhttpDeleteResults.setRequestHeader("username", username);
    xhttpDeleteResults.send();
    return false;
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

function ListJsTableData() {
    var options = {
        valueNames: [
            "pageView",
            "path",
            "description",
            "testName",
            "computerName",
            "duration",
            "startTime",
            "endTime",
            "outcome",
            "message"
        ]
    };
    resultsList = new List("results", options);
}

function parseRecordsInResultSet(recordsInSet) {
    // [Re]Set counters
    total = recordsInSet.length;
    passed = recordsInSet.filter(function (o) { return o.outcome === "Passed"; }).length;
    failed = recordsInSet.filter(function (o) { return o.outcome === "Failed"; }).length;
    durationHours = 0;
    durationMinutes = 0;
    durationSeconds = 0;
    // Get the "start date"
    startDate = new Date(Math.min.apply(null, recordsInSet.map(function (e) { return new Date(e.startTime); })));
    // Get the "end date" (last start date + its duration)
    endDate = new Date(Math.max.apply(null, recordsInSet.map(function (e) {
        var date = new Date(e.startTime);
        var dHours = parseInt(e.duration.split(":")[0]);
        date.setHours(date.getHours() + dHours);
        var dMinutes = parseInt(e.duration.split(":")[1]);
        date.setMinutes(date.getMinutes() + dMinutes);
        var dSeconds = parseInt(e.duration.split(":")[2]);
        date.setSeconds(date.getSeconds() + dSeconds);
        return date;
    })));
    // Parse the results
    for (var i = 0; i < total; i++) {
        var currentRecord = recordsInSet[i];
        // Create a new row
        var row = document.createElement("tr");
        // <td> - Configuration
        var configuration = document.createElement("td");
        {
            configuration.classList.add("configuration");
            configuration.innerText = currentRecord.configuration || "";
            row.appendChild(configuration);
        }
        // <td> - Page or View
        var testClass = document.createElement("td");
        {
            testClass.classList.add("pageView");
            var pageView = currentRecord.testClass;
            var testClassString = pageView.substring(pageView.lastIndexOf('.') + 1);
            testClassString = testClassString.split(/(?=[A-Z])/).join(" ");
            testClass.innerText = testClassString;
            row.appendChild(testClass);
        }
        // <td> - Path
        var path = document.createElement("td");
        {
            path.classList.add("path");
            var pathText = " ";
            if (currentRecord.testName.startsWith("HP_")) { pathText = "Happy"; }
            else if (currentRecord.testName.startsWith("NG_")) { pathText = "Negative"; }

            path.innerText = pathText;
            row.appendChild(path);
        }
        // <td> - Description
        var description = document.createElement("td");
        {
            description.classList.add("description");
            description.innerText = currentRecord.description;
            row.appendChild(description);
        }
        // <td> - Test Name
        var testName = document.createElement("td");
        {
            testName.classList.add("testName");
            var detailLink = document.createElement("a");
            detailLink.href = "./test-detail?test=" + currentRecord.test;
            detailLink.title = "View details for test " + currentRecord.testName;
            detailLink.innerText = currentRecord.testName;
            testName.appendChild(detailLink);
            row.appendChild(testName);
        }
        // <td> - Computer Name
        var computerName = document.createElement("td");
        {
            computerName.classList.add("computerName");
            computerName.innerText = currentRecord.computerName;
            row.appendChild(computerName);
        }
        // <td> - Duration
        var durationTd = document.createElement("td");
        {
            durationTd.classList.add("duration");
            var durationString = currentRecord.duration;
            durationString = durationString.substring(0, 12);
            durationTd.innerText = durationString;
            row.appendChild(durationTd);
            // Calculate the test's duration and add it to the running total "duration"
            var durationValue = recordsInSet[i].duration;
            durationHours += parseInt(durationValue.substring(0, durationValue.indexOf(":")));
            durationMinutes += parseInt(durationValue.substring(durationValue.indexOf(":") + 1, durationValue.lastIndexOf(":")));
            durationSeconds += parseInt(durationValue.substring(durationValue.lastIndexOf(":") + 1, durationValue.indexOf(".")));
        }
        // <td> - Start Time
        var startTime = document.createElement("td");
        {
            startTime.classList.add("startTime");
            startTime.innerText = currentRecord.startTime;
            row.appendChild(startTime);
        }
        // <td> - Outcome
        var outcome = document.createElement("td");
        {
            outcome.classList.add("outcome");
            outcome.innerText = currentRecord.outcome;
            row.appendChild(outcome);
        }
        // <td> - Message
        var message = document.createElement("td");
        {
            message.classList.add("message");
            message.innerText = currentRecord.message || "";
            row.appendChild(message);
        }
        // Style the row based on Outcome
        if (outcome.innerText === "Passed") { row.setAttribute("class", "table-success"); }
        else if (outcome.innerText === "Failed") { row.setAttribute("class", "table-danger"); }
        // Appened the row to the <tbody>
        document.getElementById("resultsTable").appendChild(row);
    }
}

function resultsCallback(recordsInSet) {
    // Parse the results and display as a <table>
    parseRecordsInResultSet(recordsInSet);
    // Calculate the times
    calculateTimes();
    // Display the results summary in a <span>
    updateResultsSummarySpan();
    // Update the <table> with the List.js functionality
    ListJsTableData();
}

function updateResultsSummarySpan() {
    try {
        document.getElementById("resultsHeader").innerText = "Results from " + unixTimeStampToDate(unixtimestamp);
    }
    catch (err) {
        /* do nothing */
    }
    document.getElementById("latestTotal").innerText = total;
    document.getElementById("latestPassed").innerText = passed + passedPercentage;
    document.getElementById("latestFailed").innerText = failed + failedPercentage;
    var date = new Date(null);
    date.setSeconds(actualDuration);
    if (window.location.href.indexOf("live") !== -1) {
        document.getElementById("actualDuration").parentElement.setAttribute("style", "display: none;");
    }
    else {
        document.getElementById("actualDuration").innerText = date.toISOString().substr(11, 8);
    }
    document.getElementById("totalDuration").innerText = totalDuration.toISOString().substr(11, 8);
}