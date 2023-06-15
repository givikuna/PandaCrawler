const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const fileName = "index.js";

function getExtension(TYPE) {
    currentFunc = "getExtension";
    try {
        if (TYPE == "script" || TYPE == "component_script") {
            return ".js";
        }
        return ".css";
    } catch (e) {
        console.log(fileName + " " + currentFunc + " ERROR: " + e);
        return ".js";
    }
}

app.get('/', function (req, res) {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    try {
        var infoFromURL = url.parse(req.url, true).query;
        res.write("[]");
        return res.end();
    } catch (e) {
        console.log(e);
        res.write("");
        return res.end();
    }
});

if (!module.parent) {
    app.listen(8094);
    console.log('Server running at http://127.0.0.1:8094/');
}
