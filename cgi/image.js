const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');
const { findPath } = require('./modules/findPath');

const fileName = "index.js";
let currentFunc = "";

app.get('/', function (req, res) {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

    try {
        var infoFromURL = url.parse(req.url, true).query;

        if ("dataType" in infoFromURL && infoFromURL.dataType == "img" && "image" in infoFromURL && "image_type" in infoFromURL) {
            fs.readFile(findPath(["src", "img", infoFromURL.image_type], infoFromURL.image), function (err, data) {
                if (err) {
                    throw err;
                }
                res.write(data);
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
    app.listen(8092);
    console.log('Server running at http://127.0.0.1:8092/');
}