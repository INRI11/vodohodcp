const electron = require('electron');
const remote = require ("electron").remote;
const BrowserWindow = electron.remote.BrowserWindow;
const globalShortcut = electron.remote.globalShortcut;

const path = require('path');
const url = require('url');
const notifier = require('node-notifier');

const prompt = require('electron-prompt');

var beautify = require('js-beautify').js;

let data = `{  "blocks": [    {      "type": "prompt",      "alignment": "left",      "segments": [        {          "type": "exit",          "style": "plain",          "foreground": "#ffffff",          "properties": {            "prefix": " ",            "postfix": ""          }        },        {          "type": "root",          "style": "plain",          "foreground": "#e83d23",          "properties": {            "root_icon": "襁"          }        },        {          "type": "session",          "style": "diamond",          "foreground": "#ffffff",          "background": "#007ACC",          "trailing_diamond": "",          "properties": {            "user_info_separator": "@",            "display_host": false,            "prefix": "<transparent></> ",            "postfix": " "          }        },        {          "type": "path",          "style": "plain",          "foreground": "#ffffff",          "background": "#007ACC",          "properties" : {              "home_icon": "~",              "folder_icon": "",              "windows_registry_icon": "",              "folder_separator_icon": "",              "style": "short",              "prefix": "<transparent></> ",              "postfix": " "          }        },        {          "type": "git",          "style": "plain",          "foreground": "#ffffff",          "background": "#007ACC",          "properties": {            "branch_icon": "",            "branch_identical_icon": "≡",            "branch_ahead_icon": "↑",            "branch_behind_icon": "↓",            "branch_gone_icon": "≢",            "local_working_icon": "",            "local_staged_icon": "",            "prefix": "<#ffffff></> ",            "postfix": " "          }        },        {          "type": "text",          "style": "plain",          "foreground": "#007ACC",          "properties": {            "prefix": "",            "text": ""          }        }      ]    }  ]}`;

// https://www.npmjs.com/package/js-beautify
class JsonFormatter {
    constructor() {
        // default
    }



    open() {
        alert(beautify(data, { indent_size: 2, space_in_empty_paren: true }));
    }


}


module.exports = JsonFormatter;