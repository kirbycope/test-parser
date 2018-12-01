// Purpose: To Get/Show records from the [liveresults] DB

var xhttpLive;

function populateLiveResultsTable() {
    xhttpLive = new XMLHttpRequest();
    xhttpLive.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            dashboardCallbackFunction();
        }
    };
    xhttpLive.open("GET", "../api/liveresults", true);
    xhttpLive.send();
}

function dashboardCallbackFunction() {
    var responseObject = JSON.parse(xhttpLive.responseText);
    for (var i = 0; i < responseObject.length; i++) {
        // Create a new row
        var row = document.createElement("tr");
        // <td> - Page or View
        var pageView = responseObject[i].testClass;
        var testClass = document.createElement("td");
        testClass.innerText = pageView.substring(pageView.lastIndexOf('.') + 1);
        row.appendChild(testClass);
        // <td> - Path
        var pathText = " ";
        if (responseObject[i].testName.startsWith("HP_")) { pathText = "Happy"; }
        else if (responseObject[i].testName.startsWith("NG_")) { pathText = "Negative"; }
        var path = document.createElement("td");
        path.innerText = pathText;
        row.appendChild(path);
        // <td> - Description
        var description = document.createElement("td");
        description.innerText = responseObject[i].description;
        row.appendChild(description);
        // <td> - Test Name
        var testName = document.createElement("td");
        var detailLink = document.createElement("a");
        detailLink.href = "/dashboard/test-detail?testName=" + responseObject[i].testName;
        detailLink.innerText = responseObject[i].testName;
        testName.appendChild(detailLink);
        row.appendChild(testName);
        // <td> - Computer Name
        var computerName = document.createElement("td");
        computerName.innerText = responseObject[i].computerName;
        row.appendChild(computerName);
        // <td> - Duration
        var duration = document.createElement("td");
        duration.innerText = responseObject[i].duration;
        row.appendChild(duration);
        // <td> - Start Time
        var startTime = document.createElement("td");
        startTime.innerText = responseObject[i].startTime;
        row.appendChild(startTime);
        // <td> - Outcome
        var outcome = document.createElement("td");
        outcome.innerText = responseObject[i].outcome;
        row.appendChild(outcome);
        // <td> - Message
        var message = document.createElement("td");
        message.innerText = responseObject[i].message || "";
        row.appendChild(message);
        // Style the row based on Outcome
        if (outcome.innerText === "Passed") { row.setAttribute("class", "alert-success"); }
        else if (outcome.innerText === "Failed") { row.setAttribute("class", "alert-danger"); }
        // Appened the row to the <tbody>
        document.getElementById("resultsTable").appendChild(row);
    }
}

populateLiveResultsTable();
