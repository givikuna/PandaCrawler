const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

import { findPath } from './modules/findPath.js';

const fileName = "index.js";

function getRandomNumber(n) {
    return Math.floor(Math.random() * n) + 1;
}

function getChosenSearchEngine() {
    return fs.readFileSync(findPath(["src", "data"], "currentlyChosenSearchEngine.txt"));
}

app.get('/', function (req, res) {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

    try {
        var infoFromURL = url.parse(req.url, true).query;

        if ("dataType" in infoFromURL && (infoFromURL.dataType == "component" || infoFromURL.dataType == "component_style") && "componentID" in infoFromURL) {
            let file = "";
            if (infoFromURL.dataType == "component_style") {
                file = "src.css";
            } else {
                file = "c.html";
            }
            fs.readFile(findPath(["src", "components", infoFromURL.componentID], file), 'utf-8', function (err, data) {
                if (err) {
                    throw err;
                } else {
                    let dataString = data.toString();
                    if (dataString.includes("@RANDOMPANDA"))
                        dataString = dataString.replace(/@RANDOMPANDA/g, getRandomNumber(28));
                    if (dataString.includes("@SEARCHENGINE"))
                        dataString = dataString.replace(/@SEARCHENGINE/g, getChosenSearchEngine());
                    res.write(dataString);
                    return res.end();
                }
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
    app.listen(8093);
    console.log('Server running at http://127.0.0.1:8093/');
}