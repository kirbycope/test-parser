var xhttpLatestUpload;

function populateLatestUploadTable() {
    xhttpLatestUpload = new XMLHttpRequest();
    xhttpLatestUpload.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            latestUploadCallbackFunction();
        }
    };
    xhttpLatestUpload.open("GET", "../api/uploads/latest", true);
    xhttpLatestUpload.setRequestHeader("username", username);
    xhttpLatestUpload.send();
}

function latestUploadCallbackFunction() {
    var responseObject = JSON.parse(xhttpLatestUpload.responseText);
    for (var i = 0; i < responseObject.length; i++) {
        // Create a new row
        var row = document.createElement("tr");
        // <td> - Test Class
        var testClass = document.createElement("td");
        testClass.innerText = responseObject[i].testClass;
        row.appendChild(testClass);
        // <td> - Test Name
        var testName = document.createElement("td");
        testName.innerText = responseObject[i].testName;
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
        // <td> - End Time
        var endTime = document.createElement("td");
        endTime.innerText = responseObject[i].endTime;
        row.appendChild(endTime);
        // <td> - Outcome
        var outcome = document.createElement("td");
        outcome.innerText = responseObject[i].outcome;
        row.appendChild(outcome);
        // <td> - Message
        var message = document.createElement("td");
        message.innerText = responseObject[i].message || "";
        row.appendChild(message);
        // Appened the row to the <tbody>
        document.getElementById("resultsTable").appendChild(row);
    }
}

populateLatestUploadTable();
