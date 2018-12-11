var xhttpProfile;

function populateProfileDetails(username) {
    xhttpProfile = new XMLHttpRequest();
    xhttpProfile.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            profileCallbackFunction();
        }
    };
    xhttpProfile.open("GET", "/api/users/profile", true);
    xhttpProfile.setRequestHeader("username", username);
    xhttpProfile.send();
}

function profileCallbackFunction() {
    var responseObject = JSON.parse(xhttpProfile.responseText);
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

populateProfileDetails(username);