const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

// Define server URLs based on the protocol
const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + "ruby.rubynetwork.co" + "/wisp/";
const bareUrl = (location.protocol === "https:" ? "https" : "http") + "://" + "ruby.rubynetwork.co" + "/bare/";

// Handle Enter key press in the URL input field
document.getElementById("urlInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("searchButton").click();
        }
    });

document.getElementById("searchButton").onclick = async function (event) {
    event.preventDefault();

    let url = document.getElementById("urlInput").value;
    let searchUrl = "https://www.google.com/search?q=";

    // If no periods are detected in the input, perform a Google search
    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        // If no http or https is detected, add https automatically
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
    }

    try {
        // Check if transport is set; if not, set it
        if (!await connection.getTransport()) {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }
        // Set the iframe source to the encoded URL
        iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    } catch (error) {
        console.error("Error setting transport or loading URL:", error);
    }
};

// Handle transport switching
document.getElementById("switcher").onchange = async function (event) {
    try {
        switch (event.target.value) {
            case "epoxy":
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                break;
            case "bare":
                await connection.setTransport("/baremod/index.mjs", [bareUrl]);
                break;
        }
    } catch (error) {
        console.error("Error switching transport:", error);
    }
};
