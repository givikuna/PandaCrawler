const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const fileName = "index.js";
var currentFunc = "";

/**
 * This function searches for a file in a folder structure specified by the input folderList.
 * It returns the full path of the file in the folder structure.
 * If the file is not found, the function returns an empty string.
 * If there is an error, it prints an error message to the console and returns an empty string.
 * 
 * @param {array} folderList The list of folders to go through
 * @param {string} requestedFile The file to find
 * @returns {string} The path of the file
 */
function globalPathFinder(folderList, requestedFile) {
    currentFunc = "globalPathFinder";
    try {
        var count = 0;
        var folderPath = "";
        if (folderList !== [] || folderList !== {} || typeof folderList == 'object') {
            for (var i = 0; i < folderList.length; i++) {
                if (typeof folderList[i] == 'string') {
                    var currentFolder = folderList[i];
                    var pathKeeper = null;
                    if (folderPath == "") {
                        pathKeeper = "./" + currentFolder;
                    } else {
                        pathKeeper = folderPath + currentFolder;
                    }
                    if (fs.existsSync(pathKeeper)) {
                        folderPath = folderPath + currentFolder + "/";
                    } else {
                        i = i - 1;
                        folderPath = folderPath + "../";
                    }
                }
                count = count + 1;
                if (count == 100) {
                    return "";
                }
            }
        }
        if (typeof requestedFile == 'string') {
            return path.join(folderPath, requestedFile);
        }
        return "";
    } catch (e) {
        console.log(fileName + " " + currentFunc + " ERROR: " + e);
        return "";
    }
}

/**
 * This function searches for a file in a folder structure specified by the input folderList.
 * It returns the full path of the file in the folder structure.
 * If the file is not found, the function returns an empty string.
 * If there is an error, it prints an error message to the console and returns an empty string.
 * 
 * @param {array} infoFromURL The array with information regarding the page given by the user
 */
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

//

/* /// */

//

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
        const PAGE = getPage(infoFromURL);
        const FILEPATH = path.join("./", "index.html");
        fs.readFile(FILEPATH, 'utf-8', function (err, data) {
            if (err) {
                console.log("index.js ERROR: " + err);
            }
            var dataString = data.toString();
            if (typeof dataString == 'string' && dataString !== "") {
                if (dataString.includes("@GIVENPAGE")) {
                    dataString = dataString.replace(/@GIVENPAGE/g, PAGE);
                }
            }
            res.write(dataString);
            return res.end();
        });
    } catch (error) {
        console.log("index.js ERROR: " + error);
    }
});

if (!module.parent) {
    app.listen(8091);
    console.log('Server running at http://127.0.0.1:8091/');
}

// If we're running under Node, 
if (typeof exports !== 'undefined') {
    exports.getPage = getPage;
    exports.globalPathFinder = globalPathFinder;
}
