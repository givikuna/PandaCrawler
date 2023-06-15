const fs = require('fs');
const path = require('path');

export function findPath(folders, req, reqFrom = 'index') {
    const def = '';
    try {
        let fPath = "";
        let foundDir = false;
        let count = 0;
        let i = 0;
        while (i < folders.length) {
            let folder = fPath + folders[i];
            if (fs.existsSync(folder)) {
                if (i === 0 && !foundDir && count === 0) {
                    foundDir = true;
                    fPath = "./";
                }
                fPath += folders[i] + "/";
                i++;
                continue;
            }
            i = -1;
            fPath += "../";
            if (count > 7) {
                break;
            }
            count++;
            i++;
        }
        let p = path.join(fPath, req);
        if (fs.existsSync(p)) {
            return p;
        }
        return def;
    } catch (e) {
        console.log(e);
        return def;
    }
}