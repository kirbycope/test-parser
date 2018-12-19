function populateLatestResultsTable() {
    var xhttpLive = new XMLHttpRequest();
    xhttpLive.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var resultSet = JSON.parse(xhttpLive.responseText);
            var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
            resultsCallback(recordsInSet);
        }
    };
    xhttpLive.open("GET", "/api/live", true);
    xhttpLive.setRequestHeader("username", username);
    xhttpLive.send();
}

populateLatestResultsTable();
