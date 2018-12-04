// Purpose: To upload a results file and then display the results

var xhttpUpload;

function submitUploadForm() {
    document.getElementById("buttonSubmit").disabled = true;
    var form = document.getElementById('uploadForm');
    var formData = new FormData(form);
    xhttpUpload = new XMLHttpRequest();
    xhttpUpload.onreadystatechange = function () {
        if (this.readyState === 4) {
            uploadCallbackFunction();
        }
    };
    xhttpUpload.open("POST", "../api/latestresults", true);
    xhttpUpload.setRequestHeader("user", user);
    xhttpUpload.send(formData);
    return false;
}

function uploadCallbackFunction() {
    document.getElementById("buttonSubmit").disabled = false;
    if (xhttpUpload.responseText === "File uploaded!") {
        window.location = "/dashboard/latest-results";
    }
}
