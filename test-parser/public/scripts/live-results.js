var xhttpLatestResults;
var resultsList;

function populateLatestResultsTable() {
    xhttpLatestResults = new XMLHttpRequest();
    xhttpLatestResults.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            latestResultsCallbackFunction();
        }
    };
    xhttpLatestResults.open("GET", "/api/results?latest=true", true);
    xhttpLatestResults.setRequestHeader("username", username);
    xhttpLatestResults.send();
}

function latestResultsCallbackFunction() {
    var resultSet = JSON.parse(xhttpLatestResults.responseText);
    var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
    
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
    ListJsTableData();
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

populateLatestResultsTable();
