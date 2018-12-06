var xhttpLive;
var resultsList;

function populateLiveResultsTable() {
    xhttpLive = new XMLHttpRequest();
    xhttpLive.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            dashboardCallbackFunction();
        }
    };
    xhttpLive.open("GET", "../api/liveresults", true);
    xhttpLive.setRequestHeader("user", user);
    xhttpLive.send();
}

function dashboardCallbackFunction() {
    var responseObject = JSON.parse(xhttpLive.responseText);
    for (var i = 0; i < responseObject.length; i++) {
        // Create a new row
        var row = document.createElement("tr");
        // <td> - Page or View
        var testClass = document.createElement("td");
        {
            testClass.classList.add("pageView");
            var pageView = responseObject[i].testClass;
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
            if (responseObject[i].testName.startsWith("HP_")) { pathText = "Happy"; }
            else if (responseObject[i].testName.startsWith("NG_")) { pathText = "Negative"; }
            
            path.innerText = pathText;
            row.appendChild(path);
        }
        // <td> - Description
        var description = document.createElement("td");
        {
            description.classList.add("description");
            description.innerText = responseObject[i].description;
            row.appendChild(description);
        }
        // <td> - Test Name
        var testName = document.createElement("td");
        {
            testName.classList.add("testName");
            var detailLink = document.createElement("a");
            detailLink.href = "./test-detail?test=" + responseObject[i].test;
            detailLink.title = "View details for test " + responseObject[i].testName;
            detailLink.innerText = responseObject[i].testName;
            testName.appendChild(detailLink);
            row.appendChild(testName);
        }
        // <td> - Computer Name
        var computerName = document.createElement("td");
        {
            computerName.classList.add("computerName");
            computerName.innerText = responseObject[i].computerName;
            row.appendChild(computerName);
        }
        // <td> - Duration
        var duration = document.createElement("td");
        {
            duration.classList.add("duration");
            var durationString = responseObject[i].duration;
            durationString = durationString.substring(0, 12);
            duration.innerText = durationString;
            row.appendChild(duration);
        }
        // <td> - Start Time
        var startTime = document.createElement("td");
        {
            startTime.classList.add("startTime");
            startTime.innerText = responseObject[i].startTime;
            row.appendChild(startTime);
        }
        // <td> - Outcome
        var outcome = document.createElement("td");
        {
            outcome.classList.add("outcome");
            outcome.innerText = responseObject[i].outcome;
            row.appendChild(outcome);
        }
        // <td> - Message
        var message = document.createElement("td");
        {
            message.classList.add("message");
            message.innerText = responseObject[i].message || "";
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

populateLiveResultsTable();
