var xhttpTestDetail;

function populateTestDetails(test) {
    xhttpTestDetail = new XMLHttpRequest();
    xhttpTestDetail.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            detailCallbackFunction();
        }
    };
    xhttpTestDetail.open("GET", "/api/live/" + test, true);
    xhttpTestDetail.setRequestHeader("username", username);
    xhttpTestDetail.send();
}

function detailCallbackFunction() {
    var responseObject = JSON.parse(xhttpTestDetail.responseText);
    for (var property in responseObject) {
        var propertyName = property.toString();

        var row = document.createElement("div");
        row.setAttribute("class", "row");
        document.getElementById("container").appendChild(row);

        var wrapper = document.createElement("div");
        wrapper.style = "width: 100%;";
        row.appendChild(wrapper);

        var label = document.createElement("label");
        label.style = "width: 25%;";
        label.setAttribute("for", propertyName);
        label.innerText = propertyName;
        wrapper.appendChild(label);

        var input = document.createElement("input");
        input.type = "text";
        input.style = "width: 50%;";
        input.disabled = true;
        input.id = propertyName;
        input.value = responseObject[propertyName];
        wrapper.appendChild(input);
    }
}

populateTestDetails(test);