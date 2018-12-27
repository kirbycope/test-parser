function populateSearchLinks() {
    var xhttpSearch = new XMLHttpRequest();
    xhttpSearch.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            searchResultsLinksCallbackFunction(xhttpSearch);
        }
    };
    xhttpSearch.open("GET", "/api/live/tests", true);
    xhttpSearch.setRequestHeader("username", username);
    xhttpSearch.send();
}
var myList;
function searchResultsLinksCallbackFunction(xhttpSearch) {
    // Get the results
    var searchResults = JSON.parse(xhttpSearch.responseText);
    // Parse the results
    var ulSearchResults = document.getElementById("searchResults");
    for (var i = 0; i < searchResults.Items.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.classList.add("test");
        a.style = "text-decoration: none;";
        a.innerText = searchResults.Items[i].test;
        a.href = "/app/test-detail?test=" + searchResults.Items[i].test;
        li.appendChild(a);
        ulSearchResults.appendChild(li);
    }
    // Update the <ul> with the List.js functionality
    myList = new List("test-list", {
        valueNames: ["test"]
    });
}

// Execute a function when the user releases a key on the keyboard
document.getElementById("searchTestName").addEventListener("keyup", function (event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        var testName = event.target.value;
        if (testName.length > 0) {
            window.location = "./test-detail?test=" + testName;
        }
    }
    else {
        // Toggle display of search results
        var divSearchResults = document.getElementById("searchResults");
        if (event.target.value.length > 0) {
            divSearchResults.style = "display: block; list-style: none; position: absolute;";
        }
        else {
            divSearchResults.style = "display: none;";
        }
    }
});

populateSearchLinks();
