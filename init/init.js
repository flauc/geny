"use strict";
const co = require("co");
const prompt = require("co-prompt");
const initPrompt_1 = require("./initPrompt");
const filer_1 = require("../helpers/filer");
const simple_1 = require("./apps/simple");
function init() {
    return new Promise((resolve, reject) => {
        let jsonObject = {};
        console.log(initPrompt_1.initPrompt.intro);
        co(function* () {
            let appFolderPrompt = yield prompt("App Folder: (app) "), bootLocationPrompt = yield prompt("Location of bootstrap file: (boot.ts) "), componentsFolderPrompt = yield prompt("Components Folder: (common/components) "), servicesFolderPrompt = yield prompt("Services Folder: (common/services) "), directivesFolderPrompt = yield prompt("Directives Folder: (common/directives) "), pipesFolderPrompt = yield prompt("Pipes Folder: (common/pipes) "), generateApp = (yield prompt("Create starter app? (Y/n) ")) || "Y";
            while (!(/^([yn]|(yes)|(no))$/ig.test(generateApp)))
                generateApp = yield prompt("Create starter app? (Y/n) ");
            return { json: {
                    appFolder: appFolderPrompt ? appFolderPrompt : "app",
                    bootLocation: bootLocationPrompt ? bootLocationPrompt : "boot.ts",
                    componentsFolder: componentsFolderPrompt ? componentsFolderPrompt : "common/components",
                    servicesFolder: servicesFolderPrompt ? servicesFolderPrompt : "common/services",
                    directivesFolder: directivesFolderPrompt ? directivesFolderPrompt : "common/directives",
                    pipesFolder: pipesFolderPrompt ? pipesFolderPrompt : "common/pipes"
                },
                generateApp: /^([y]|(yes))$/ig.test(generateApp) };
        }).then(values => {
            jsonObject = values.json;
            if (values.generateApp) {
                Promise.all([
                    filer_1.createFile(simple_1.index(values.json.appFolder, values.json.bootLocation), "index", "html"),
                    filer_1.createFile(simple_1.tsconfig, "tsconfig", "json"),
                    filer_1.createFile(simple_1.packageJson, "package", "json"),
                    filer_1.createFile(simple_1.typings, "typings", "json"),
                    filer_1.createFile(simple_1.packageJson, "package", "json"),
                    filer_1.createFile(simple_1.boot, `${values.appFolder}boot`, "ts"),
                    filer_1.createFile(simple_1.appComponent, `${values.appFolder}app.component`, "ts"),
                ])
                    .catch(err => reject(err))
                    .then(() => resolve("Application created successfully."));
            }
            else {
                filer_1.createFile(filer_1.createTemplateStringFromObject(jsonObject), "genli", "json")
                    .catch(err => reject(err))
                    .then(() => resolve("Config folder created successfully."));
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = init;