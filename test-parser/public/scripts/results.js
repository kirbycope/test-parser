function populateResultsSetsTable(unixtimestamp) {
    var xhttpResults = new XMLHttpRequest();
    xhttpResults.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var resultSet = JSON.parse(xhttpResults.responseText);
            var recordsInSet = resultSet[[Object.keys(resultSet)[0]]];
            resultsCallback(recordsInSet);
        }
    };
    xhttpResults.open("GET", "/api/results/" + unixtimestamp, true);
    xhttpResults.setRequestHeader("username", username);
    xhttpResults.send();
}

populateResultsSetsTable(unixtimestamp);
