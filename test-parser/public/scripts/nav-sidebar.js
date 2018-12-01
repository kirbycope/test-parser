function activeSelection() {
    var pathname = window.location.pathname;
    if (pathname === "/dashboard") {
        document.getElementById("home").classList.add("active");
    }
    else if (pathname === "/dashboard/live-results") {
        document.getElementById("live").classList.add("active");
    }
    else if (pathname === "/dashboard/upload-results") {
        document.getElementById("upload").classList.add("active");
    }
    else if (pathname === "/dashboard/latest-results") {
        document.getElementById("latest").classList.add("active");
    }
}

activeSelection();