const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const fileName = "index.js";
let currentFunc = "";

function globalPathFinder(folderList, requestedFile) {
    currentFunc = "globalPathFinder";
    try {
        let folderPath = "";
        let foundFolder = false;
        let count = 0;
        let i = 0;
        while (i < folderList.length) {
            let folder = folderPath + folderList[i];
            if (fs.existsSync(folder)) {
                if (foundFolder === false && count === 0 && i === 0) {
                    foundFolder = true;
                    folderPath = "./";
                }
                folderPath += folderList[i] + "/";
                i++;
                continue;
            }
            i = -1;
            folderPath += "../";
            if (count > 7)
                break;
            count++;
            i++;
        }
        if (typeof requestedFile == 'string') {
            return path.join(folderPath, requestedFile);
        }
        return "";
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "";
    }
}

function getRandomNumber(n) {
    return Math.floor(Math.random() * n) + 1;
}

function getChosenSearchEngine() {
    return fs.readFileSync(globalPathFinder(["src", "data"], "currentlyChosenSearchEngine.txt"));
}

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;

        if ("dataType" in infoFromURL && infoFromURL.dataType == "component" && "componentID" in infoFromURL) {
            fs.readFile(globalPathFinder(["src", infoFromURL.dataType + "s", infoFromURL.componentID], "c.html"), 'utf-8', function (err, data) {
                if (err) {
                    throw err;
                } else {
                    let dataString = data.toString();
                    if (dataString.includes("@RANDOMPANDA")) {
                        dataString = dataString.replace(/@RANDOMPANDA/g, getRandomNumber(28));
                    } else if (dataString.includes("@SEARCHENGINE")) {
                        dataString = dataString.replace(/@SEARCHENGINE/g, getChosenSearchEngine());
                    }
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