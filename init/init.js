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
            let pathValidator = /^(([A-z0-9\-\%]+\/)*[A-z0-9\-\%]+$)/g, pathFileValidator = /^(([A-z0-9\-\%]+\/)*[A-z0-9\-\%]+(.ts)+$)/g, ynValidator = /^([yn]|(yes)|(no))$/ig, introMessage = (format) => `\nPlease enter a path matching the following format:\n${format}\nDon't add a leading or trailing slash to the path.\n`, prompts = [
                {
                    name: "appFolder",
                    question: "App Folder: (app) ",
                    value: "app",
                    message: "something/foo/bar",
                    validator: pathValidator
                },
                {
                    name: "bootFile",
                    question: "Location of bootstrap file: (boot.ts) ",
                    value: "boot.ts",
                    message: "something/foo/bar.ts",
                    validator: pathFileValidator
                },
                {
                    name: "componentsFolder",
                    question: "Components Folder: (common/components) ",
                    value: "common/components",
                    message: "something/foo/bar",
                    validator: pathValidator
                },
                {
                    name: "servicesFolder",
                    question: "Services Folder: (common/services) ",
                    value: "common/services",
                    message: "something/foo/bar",
                    validator: pathValidator
                },
                {
                    name: "directivesFolder",
                    question: "Directives Folder: (common/directives) ",
                    value: "common/directives",
                    message: "something/foo/bar",
                    validator: pathValidator
                },
                {
                    name: "pipesFolder",
                    question: "Pipes Folder: (common/pipes) ",
                    value: "common/pipes",
                    message: "something/foo/bar",
                    validator: pathValidator
                },
                {
                    name: "generateApp",
                    question: "Create starter app? (Y/n) ",
                    value: "Y",
                    message: null,
                    validator: ynValidator
                }
            ], values = {};
            for (let i = 0; i < prompts.length; i++) {
                values[prompts[i].name] = yield prompt(prompts[i].question);
                if (!values[prompts[i].name])
                    values[prompts[i].name] = prompts[i].value;
                while (prompts[i].validator.test(values[prompts[i].name])) {
                    if (prompts[i].message)
                        console.log(introMessage(prompts[i].message));
                    values[prompts[i].name] = yield prompt(prompts[i].question);
                }
            }
            let generateApp = (yield prompt("Create starter app? (Y/n) ")) || "Y";
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
                    filer_1.createFile(filer_1.createTemplateStringFromObject(jsonObject), "ng2config", "json"),
                    filer_1.createFile(simple_1.index(values.json.appFolder, values.json.bootLocation), "index", "html"),
                    filer_1.createFile(simple_1.tsconfig, "tsconfig", "json"),
                    filer_1.createFile(simple_1.packageJson, "package", "json"),
                    filer_1.createFile(simple_1.typings, "typings", "json"),
                    filer_1.createFile(simple_1.packageJson, "package", "json"),
                    filer_1.createFile(simple_1.boot, `${values.json.appFolder}/boot`, "ts"),
                    filer_1.createFile(simple_1.appComponent, `${values.json.appFolder}/app.component`, "ts"),
                ])
                    .catch(err => reject(err))
                    .then(() => {
                    console.log("Application created. Attempting to run scripts now.");
                    resolve(false);
                });
            }
            else {
                filer_1.createFile(filer_1.createTemplateStringFromObject(jsonObject), "ng2config", "json")
                    .catch(err => reject(err))
                    .then(() => resolve("ng2config.json created successfully."));
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = init;
