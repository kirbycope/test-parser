// Purpose: To upload a results file and then display the results

var xhttp;

function submitUploadForm() {
    document.getElementById("buttonSubmit").disabled = true;
    var form = document.getElementById('uploadForm');
    var formData = new FormData(form);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            uploadCallbackFunction();
        }
    };
    xhttp.open("POST", "../api/latestresults", true);
    xhttp.send(formData);
    return false;
}

function uploadCallbackFunction() {
    document.getElementById("buttonSubmit").disabled = false;
    if (xhttp.responseText === "File uploaded!") {
        window.location = "/dashboard/latest-results";
    }
}
