function populateLastestResultsSummary() {
    var xhttpLiveResultsSummary = new XMLHttpRequest();
    xhttpLiveResultsSummary.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var resultSet = JSON.parse(xhttpLiveResultsSummary.responseText);
            var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
            resultsCallback(recordsInSet);
        }
    };
    xhttpLiveResultsSummary.open("GET", "/api/live", true);
    xhttpLiveResultsSummary.setRequestHeader("username", username);
    xhttpLiveResultsSummary.send();
}

populateLastestResultsSummary();
