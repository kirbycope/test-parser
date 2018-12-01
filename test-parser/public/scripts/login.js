var xhttp;

function submitLoginForm() {
    document.getElementById("alertMessage").setAttribute("style", "display: none;");
    document.getElementById("buttonSubmit").disabled = true;
    var username = document.getElementById("inputEmail").value;
    username = "username=" + encodeURIComponent(username);
    var password = document.getElementById("inputPassword").value;
    password = "password=" + encodeURIComponent(password);
    var data = username + "&" + password;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            loginCallbackFunction();
        }
    };
    xhttp.open("POST", "./api/users/login", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return false;
}

function loginCallbackFunction() {
    if (xhttp.responseText === "OK") {
        window.location = "./dashboard";
    }
    else {
        document.getElementById("alertMessage").setAttribute("style", "display: block;");
        document.getElementById("alertMessage").innerHTML = xhttp.responseText;
    }
    document.getElementById("buttonSubmit").disabled = false;
}
