var xhttpResults;
var resultsList;
var failed;
var passed;

function populateResultsSetsTable(unixtimestamp) {
    xhttpResults = new XMLHttpRequest();
    xhttpResults.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            resultsSetsCallbackFunction();
        }
    };
    xhttpResults.open("GET", "/api/results/" + unixtimestamp, true);
    xhttpResults.setRequestHeader("username", username);
    xhttpResults.send();
}

function resultsSetsCallbackFunction() {
    // Get the results
    var resultSet = JSON.parse(xhttpResults.responseText);
    var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
    var total = recordsInSet.length;

    // [Re]Set counters
    passed = recordsInSet.filter(function (o) { return o.outcome === "Passed"; }).length;
    failed = recordsInSet.filter(function (o) { return o.outcome === "Failed"; }).length;
    var durationHours = 0;
    var durationMinutes = 0;
    var durationSeconds = 0;
    // Parse the results
    for (var i = 0; i < recordsInSet.length; i++) {
        var currentRecord = recordsInSet[i];
        // Create a new row
        var row = document.createElement("tr");
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
        var duration = document.createElement("td");
        {
            duration.classList.add("duration");
            var durationString = currentRecord.duration;
            durationString = durationString.substring(0, 12);
            duration.innerText = durationString;
            row.appendChild(duration);

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
    // Calculate the times
    var minutesAsSeconds = durationMinutes * 60;
    var hoursAsSeconds = (durationHours * 60) * 60;
    var totalSeconds = minutesAsSeconds + hoursAsSeconds + durationSeconds;
    var date = new Date(null);
    date.setSeconds(totalSeconds);
    var passedPercentage = " (" + ((passed / total) * 100).toString().substring(0, 4) + "%)";
    var failedPercentage = " (" + ((failed / total) * 100).toString().substring(0, 4) + "%)";
    // Display the results
    ListJsTableData();
    document.getElementById("resultsHeader").innerText = "Results from " + unixTimeStampToDate(unixtimestamp);
    document.getElementById("latestTotal").innerText = total;
    document.getElementById("latestPassed").innerText = passed + passedPercentage;
    document.getElementById("latestFailed").innerText = failed + failedPercentage;
    document.getElementById("duration").innerText = date.toISOString().substr(11, 8);
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

populateResultsSetsTable(unixtimestamp);