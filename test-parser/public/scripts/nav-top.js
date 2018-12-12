// Get the input field
var input = document.getElementById("searchTestName");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        var testName = event.target.value;
        if (testName.length > 0) {
            // TODO search for a record, but for now just you the value as a qs param
            window.location = "/test-detail?testName=" + testName;
        }
    }
});
