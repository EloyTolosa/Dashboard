export { Request, Alert, pad };

import { ApiToken } from './constants.js';

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function error(fname, msg) {
    console.log("ERROR: " + fname + ": " + msg + "\n")
}

function Alert(fname, msg) {
    alert("ERROR: " + fname + ": " + msg + "\n")
}


function Request(url, method, data = {}) {

    if (method != "GET" && method != "POST") {
        error("GET", "Invalid method. Options: [GET|POST]")
        return false
    }

    return $.ajax({
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        method: method,
        headers: {
            authorization: "Bearer " + ApiToken
        },
        cache: true, // NOTE: prevents adding timestamp at the end of the request
        data: data,
    });
}