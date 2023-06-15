const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');
const http = require('http');

const fileName = "index.js";
let currentFunc = "";

import { findPath } from './modules/findPath.js';

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
    try {
        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

        let wrote = false;

        var infoFromURL = url.parse(req.url, true).query;

        if ("dataType" in infoFromURL && (infoFromURL.dataType == "script" || infoFromURL.dataType == "style")) {
            let pth = findPath(["src", infoFromURL.dataType], infoFromURL.dataType + getExtension(infoFromURL.dataType));
            if (fs.existsSync(pth)) {
                let data = fs.readFileSync(pth, 'utf-8');
                res.write(data);
                return res.end();
            }
        }
        res.write("");
        return res.end();
    } catch (e) {
        console.log(e);
        res.write("");
        return res.end();
    }
});

if (!module.parent) {
    app.listen(8095);
    console.log('Server running at http://127.0.0.1:8092/');
}
