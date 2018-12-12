var xhttpLive;

function populateLatestResultsTable() {
    xhttpLive = new XMLHttpRequest();
    xhttpLive.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            latestResultsCallbackFunction();
        }
    };
    xhttpLive.open("GET", "/api/live", true);
    xhttpLive.setRequestHeader("username", username);
    xhttpLive.send();
}

function latestResultsCallbackFunction() {
    // Get the results
    var resultSet = JSON.parse(xhttpLive.responseText);
    var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
    // Parse the results
    parseRecordsInResultSet(recordsInSet);
    // Calculate the times
    calculateTimes();
    // Display the results in a <table>
    updateResultsSummarySpan();
    // Update the <table> with the List.js functionality
    ListJsTableData();
}

populateLatestResultsTable();
