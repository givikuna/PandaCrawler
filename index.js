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

function getRandomNumber() {
    return Math.floor(Math.random() * 28) + 1;
}

function getChosenSearchEngine() {
    return fs.readFileSync(globalPathFinder(["src", "data"], "currentlyChosenSearchEngine.txt"));
}

//

/* /// */

//

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
        function returnEmpty(err) {
            console.log(err);
            res.write("");
            return res.end();
        }

        function repeat(err, data) {
            if (err) {
                return returnEmpty(err);
            } else {
                res.write(data.toString());
                return res.end();
            }
        }

        if ("type" in infoFromURL && infoFromURL.type == "data" && "dataType" in infoFromURL) {
            const TYPE = infoFromURL.dataType;
            if (TYPE == "json") {
                res.write("[]");
                return res.end(); // temp
            } else if (TYPE == "script" || TYPE == "style") {
                fs.readFile(globalPathFinder(["src", TYPE], TYPE + getExtension(TYPE)), 'utf-8', function (err, data) {
                    return repeat(err, data);
                });
            } else if (TYPE == "component" && "componentID" in infoFromURL) {
                fs.readFile(globalPathFinder(["src", TYPE + "s", infoFromURL.componentID], "c.html"), 'utf-8', function (err, data) {
                    if (err) {
                        return returnEmpty(err);
                    } else {
                        let dataString = data.toString();
                        if (dataString.includes("@RANDOMPANDA")) {
                            dataString = dataString.replace(/@RANDOMPANDA/g, getRandomNumber());
                        } else if (dataString.includes("@SEARCHENGINE")) {
                            let theChosenSearchEngine = getChosenSearchEngine();
                            dataString = dataString.replace(/@SEARCHENGINE/g, theChosenSearchEngine);
                        }
                        res.write(dataString);
                        return res.end();
                    }
                });
            } else if ((TYPE == "component_style" || TYPE == "component_script") && "componentID" in infoFromURL) {
                fs.readFile(globalPathFinder(["src", "components", infoFromURL.componentID], "src" + getExtension(TYPE)), 'utf-8', function (err, data) {
                    return repeat(err, data);
                });
            } else if (TYPE == "img" && "image" in infoFromURL && "image_type" in infoFromURL) {
                res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                fs.readFile(globalPathFinder(["src", "img", infoFromURL.image_type], infoFromURL.image), function (err, data) {
                    if (err) {
                        return returnEmpty(err);
                    } else {
                        res.write(data);
                        return res.end();
                    }
                });
            }
        } else {
            const PAGE = getPage(infoFromURL);
            const FILEPATH = path.join("./", "index.html");
            fs.readFile(FILEPATH, 'utf-8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                var dataString = data.toString();
                if (typeof dataString == 'string' && dataString !== "") {
                    if (dataString.includes("@GIVENPAGE") == true) {
                        dataString = dataString.replace(/@GIVENPAGE/g, PAGE);
                    }
                }
                res.write(dataString);
                return res.end();
            });
        }
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
