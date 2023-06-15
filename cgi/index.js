const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const fileName = "index.js";
let currentFunc = "";

import { findPath } from './modules/findPath.js';

function getPage(infoFromURL) {
    currentFunc = "getPage";
    try {
        if ("page" in infoFromURL) {
            return infoFromURL.page;
        }
        return "home";
    } catch (e) {
        console.log(fileName + " " + currentFunc + " ERROR: " + e);
        return "home";
    }
}

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
        const PAGE = getPage(infoFromURL);
        const FILEPATH = findPath(["www"], "index.html");
        if (fs.existsSync(FILEPATH)) {
            fs.readFile(FILEPATH, 'utf-8', function (err, data) {
                if (err) {
                    throw err;
                }
                let dataString = data.toString();
                if (typeof dataString == 'string' && dataString !== "" && dataString.includes("@GIVENPAGE")) {
                    dataString = dataString.replace(/@GIVENPAGE/, PAGE);
                }
                res.write(dataString);
                return res.end();
            });
        } else {
            res.write("");
            return res.end();
        }
    } catch (e) {
        console.log(e);
        res.write("");
        return res.end();
    }
});

if (!module.parent) {
    app.listen(8091);
    console.log('Server running at http://127.0.0.1:8091/');
}