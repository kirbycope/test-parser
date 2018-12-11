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
    xhttpUpload.open("POST", "/api/upload", true);
    xhttpUpload.setRequestHeader("username", username);
    xhttpUpload.send(formData);
    return false;
}

function uploadCallbackFunction() {
    document.getElementById("buttonSubmit").disabled = false;
    if (xhttpUpload.responseText === "File uploaded!") {
        window.location = "/dashboard/latest-upload";
    }
}
