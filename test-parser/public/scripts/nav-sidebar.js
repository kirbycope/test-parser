function activeSelection() {
    var pathname = window.location.pathname;
    if (pathname.includes("/dashboard")) {
        document.getElementById("home").classList.add("active");
    }
    else if (pathname.includes("/live-results")) {
        document.getElementById("live").classList.add("active");
    }
    else if (pathname.includes("/upload-results")) {
        document.getElementById("upload").classList.add("active");
    }
    else if (pathname.includes("/latest-results")) {
        document.getElementById("latest").classList.add("active");
    }
}

activeSelection();