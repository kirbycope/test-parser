var xhttp;

function submitLoginForm() {
    document.getElementById("alertMessage").setAttribute("style", "display: none;");
    document.getElementById("buttonSubmit").disabled = true;
    var email = document.getElementById("inputEmail").value;
    email = "email=" + encodeURIComponent(email);
    var password = document.getElementById("inputPassword").value;
    password = "password=" + encodeURIComponent(password);
    var data = email + "&" + password;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            loginCallbackFunction();
        }
    };
    xhttp.open("POST", "/api/users/login", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return false;
}

function loginCallbackFunction() {
    if (xhttp.responseText.includes("/dashboard")) {
        window.location = xhttp.responseText;
    }
    else {
        document.getElementById("alertMessage").setAttribute("style", "display: block;");
        document.getElementById("alertMessage").innerHTML = "Invalid credentials.";
    }
    document.getElementById("buttonSubmit").disabled = false;
}

function resetLogoutUrl() {
    if (window.location.pathname === "/logout") {
        window.location.pathname = "/login";
    }
}

resetLogoutUrl();
