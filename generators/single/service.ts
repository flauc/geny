import * as fs from "fs"
import * as path from "path"
import {capitalize, lower, createLocation, readJson} from "../../helpers/helpers"
import {createFile} from "../../helpers/filer"

export function createService(locationAndName: string, bootInject) {

    return new Promise((resolve, reject) => {

        let split = locationAndName.split("/"),
            selectorName = lower(split[split.length - 1]),
            fileName = `${selectorName}.service`,
            serviceName = `${capitalize(selectorName)}Service`,
            location = createLocation(split, fileName),

            initialComponent = `import {Injectable} from "angular2/core";

@Injectable()
export class ${serviceName} {
    constructor() {}
}`;

        createFile(initialComponent, location, "ts")
            .catch(err => reject(err))
            .then(val => afterCreate(val, bootInject, serviceName, location))
            .catch(err => reject(err))
            .then(res => resolve(res));

    })
}

function afterCreate(val, bootInject, serviceName, location) {
    return new Promise((resolve, reject) => {
        if (bootInject) {
            readJson()
                .catch(err => reject(err))
                .then(res => addToBoot(res, serviceName, location))
                .catch(err => reject(err))
                .then(res => resolve(res))
        }

        else resolve(val)
    })
}

// Add the strings to boot.ts
function addToBoot(jsonObj, serviceName, location) {
    return new Promise((resolve, reject) => {
        fs.readFile(jsonObj.bootLocation, "utf8", (err, data) => {
            if (err) reject(err);
            else {
                let match1 = /\/\/\ genli:bootImport/.exec(data),
                    match2 = /\/\/\ genli:bootInject/.exec(data);

                if (match1 && match2) {
                    let pos1 = match1.index + "// genli:bootImport".length,
                        partOne = [
                            data.slice(0, pos1),
                            `\nimport {${serviceName}} from "${path.relative(jsonObj.bootLocation, location).replace(new RegExp("/\\/g"), "/").replace(/\\/g, "/")}"`,
                            data.slice(pos1)
                        ].join(""),
                        pos2 = /\/\/\ genli:bootInject/.exec(partOne).index + "// genli:bootInject".length,
                        partTwo = [
                            partOne.slice(0, pos2),
                            `\n    ${serviceName}`,
                            partOne.slice(pos2)
                        ].join("");

                    fs.writeFile(jsonObj.bootLocation, partTwo, err => {
                        if (err) reject(err);
                        else resolve("Service created and injected in to boot.ts successfully.")
                    })
                }

                else reject("There is no genli:bootInject or genli:bootImport location in the boot.ts file.")

            }
        })
    })
}