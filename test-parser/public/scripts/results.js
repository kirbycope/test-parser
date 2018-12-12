var xhttpResults;

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
    // Parse the results
    parseRecordsInResultSet(recordsInSet);
    // Calculate the times
    calculateTimes();
    // Display the results in a <table>
    updateResultsSummarySpan();
    // Update the <table> with the List.js functionality
    ListJsTableData();
}

populateResultsSetsTable(unixtimestamp);
