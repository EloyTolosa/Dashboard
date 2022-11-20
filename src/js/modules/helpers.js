export { Request, Alert, pad, getObjectFromLocalStorage };

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

// gets data from localstorage, checks if its not null, parses it
// and executes callback with certain params in case data is null
async function getObjectFromLocalStorage(key, callback = null, ...params) {
    if (key == "") {
        Alert('getFromLocalStorage', "key must be set")
    }

    if (callback == null) {
        Alert('getFromLocalStorage', "callback must be set")
    }

    var data;
    var dataStr = localStorage.getItem(key)
    if (dataStr == null || dataStr == "") {
        data = await callback(...params)
        localStorage.setItem(key, JSON.stringify(data))
    } else {
        data = JSON.parse(dataStr)
    }

    return data;
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