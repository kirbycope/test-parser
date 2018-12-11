function activeSelection() {
    var pathname = window.location.pathname;
    if (pathname.includes("/dashboard")) {
        document.getElementById("home").classList.add("active");
    }
    else if (pathname.includes("/latest-results")) {
        document.getElementById("latestResults").classList.add("active");
    }
    else if (pathname.includes("/upload-results")) {
        document.getElementById("upload").classList.add("active");
    }
    else if (pathname.includes("/latest-upload")) {
        document.getElementById("latestUpload").classList.add("active");
    }
}

activeSelection();