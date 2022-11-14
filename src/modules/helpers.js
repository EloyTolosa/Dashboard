export { Request, Alert };

import { ApiToken } from './constants.js';

function error(fname, msg) {
    console.log("ERROR: " + fname + ": " + msg + "\n")
}

function Alert(fname, msg) {
    alert("ERROR: " + fname + ": " + msg + "\n")
}


function Request(url, method, data, done, fail) {

    if (data == null) {
        data = {}
    }

    if (method != "GET" && method != "POST") {
        error("GET", "Invalid method. Options: [GET|POST]")
        return false
    }

    var request = $.ajax({
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

    if (done != null) {
        request.done(done)
    } else {
        request.done(function (responseText) {
            console.log("done");
            console.log(responseText);
        })
    }

    if (fail != null) {
        request.fail(fail)
    } else {
        request.fail(function (statusText) {
            console.log("Fail: "+statusText);
        })
    }

    return request
}