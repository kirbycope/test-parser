var xhttpLastTen;

function populateLastTenResultsLinks() {
    xhttpLastTen = new XMLHttpRequest();
    xhttpLastTen.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            lastTenResultsLinksCallbackFunction();
        }
    };
    xhttpLastTen.open("GET", "/api/results?lastTen=true", true);
    xhttpLastTen.setRequestHeader("username", username);
    xhttpLastTen.send();
}

function lastTenResultsLinksCallbackFunction() {
    // Get the results
    var resultsSets = JSON.parse(xhttpLastTen.responseText);
    var recordsInSet = resultsSets[[Object.keys(resultsSets)[0]]];
    recordsInSet.sort(function (a, b) {
        return parseFloat(b.unixtimestamp) - parseFloat(a.unixtimestamp);
    });
    var total = recordsInSet.length;
    // Create a link for each results set
    for (var i = 0; i < total; i++) {
        var unixtimestamp = recordsInSet[i].unixtimestamp;
        // Create the <li>
        var lineItem = document.createElement("li");
        lineItem.classList.add("nav-item");
        // Create the <a>
        var anchor = document.createElement("a");
        anchor.href = "/app/results/" + unixtimestamp;
        anchor.id = unixtimestamp;
        anchor.classList.add("nav-link");
        anchor.title = "Results Set " + unixtimestamp;
        // Create the <span> that feather.js will replace with a <svg>
        var spanSvg = document.createElement("span");
        spanSvg.setAttribute("data-feather", "file-text");
        // Add the <span> into the <a>
        anchor.appendChild(spanSvg);
        // Create the <span> for the text
        var spanText = document.createElement("span");
        spanText.innerText = " " + unixTimeStampToDate(unixtimestamp);
        // Add the <span> into the <a>
        anchor.appendChild(spanText);
        // Add the <a> into the <li>
        lineItem.appendChild(anchor);
        // Add the <li> to the <ul id="resultsSets">
        document.getElementById("resultsSets").appendChild(lineItem);
    }
    // Load the "feather" icons
    feather.replace();
    // Highlight the active page
    activeSelection();
}

function activeSelection() {
    var pathname = window.location.pathname;
    if (pathname.includes("/dashboard")) {
        try {
            document.getElementById("home").classList.add("active");
        }
        catch (err) { /* do nothing */ }
    }
    else if (pathname.includes("/live-results")) {
        try {
            document.getElementById("liveResults").classList.add("active");
        }
        catch (err) { /* do nothing */ }
    }
    else if (pathname.includes("/upload-results")) {
        try {
            document.getElementById("upload").classList.add("active");
        }
        catch (err) { /* do nothing */ }
    }
    else if (pathname.includes("/latest-upload")) {
        try {
            document.getElementById("latestUpload").classList.add("active");
        }
        catch (err) { /* do nothing */ }
    }
    else if (pathname.includes("/results/")) {
        try {
            document.getElementById(unixtimestamp).classList.add("active");
        }
        catch (err) { /* do nothing */ }
    }
}

populateLastTenResultsLinks();
