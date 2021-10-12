const electron = require('electron');
const remote = require ("electron").remote;
const BrowserWindow = electron.remote.BrowserWindow;
const globalShortcut = electron.remote.globalShortcut;

const path = require('path');
const url = require('url');
const notifier = require('node-notifier');

const prompt = require('electron-prompt');

var beautify = require('js-beautify').js;
const JPP = require('jsonpath-picker-vanilla');

let data = `{  "blocks": [    {      "type": "prompt",      "alignment": "left",      "segments": [        {          "type": "exit",          "style": "plain",          "foreground": "#ffffff",          "properties": {            "prefix": " ",            "postfix": ""          }        },        {          "type": "root",          "style": "plain",          "foreground": "#e83d23",          "properties": {            "root_icon": "襁"          }        },        {          "type": "session",          "style": "diamond",          "foreground": "#ffffff",          "background": "#007ACC",          "trailing_diamond": "",          "properties": {            "user_info_separator": "@",            "display_host": false,            "prefix": "<transparent></> ",            "postfix": " "          }        },        {          "type": "path",          "style": "plain",          "foreground": "#ffffff",          "background": "#007ACC",          "properties" : {              "home_icon": "~",              "folder_icon": "",              "windows_registry_icon": "",              "folder_separator_icon": "",              "style": "short",              "prefix": "<transparent></> ",              "postfix": " "          }        },        {          "type": "git",          "style": "plain",          "foreground": "#ffffff",          "background": "#007ACC",          "properties": {            "branch_icon": "",            "branch_identical_icon": "≡",            "branch_ahead_icon": "↑",            "branch_behind_icon": "↓",            "branch_gone_icon": "≢",            "local_working_icon": "",            "local_staged_icon": "",            "prefix": "<#ffffff></> ",            "postfix": " "          }        },        {          "type": "text",          "style": "plain",          "foreground": "#007ACC",          "properties": {            "prefix": "",            "text": ""          }        }      ]    }  ]}`;

// https://www.npmjs.com/package/js-beautify
class JsonFormatter {
    constructor() {
        // default
        this.code = '';
    }

    open() {
        //
        this.openJsonCode();
    }

    openJsonCode() {
        let elWrapper = document.getElementById('elWrapper');
        let htmlCode = `<div class='v-json-wrapper h-100'>
                        <div class='v-json-actions'>
                            <button class='v-btn' onclick="onJsonCode()">Код</button>
                            <button class='v-btn' onclick="onJsonTree()">Дерево</button>
                            <button class='v-btn' onclick="onJsonCodeFormatter()">Форматировать</button>
                        </div>
                        <div class='row h-100'>
                            <div class='col-12'>
                                <div class='v-json-code h-100'>
                                    <textarea class='h-100' id='elTextareaJsonCode'>${this.code}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>`;
        
        elWrapper.innerHTML = htmlCode;
    }

    openJsonTree() {
        let elTextareaJsonCode = document.getElementById('elTextareaJsonCode');
        this.code = elTextareaJsonCode.value;

        let elWrapper = document.getElementById('elWrapper');
        let htmlCode = `<div class='v-json-wrapper h-100'>
                        <div class='v-json-actions'>
                            <button class='v-btn' onclick="onJsonCode()">Код</button>
                            <button class='v-btn' onclick="onJsonTree()">Дерево</button>
                            <input type='text' class='elJsonTreePath' />
                        </div>
                        <div class='row h-100'>
                            <div class='col-12'>
                                <div class='v-json-code h-100'>
                                    <div class='v-json-tree' id='elJsonTree'></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        
        elWrapper.innerHTML = htmlCode;

        let elJsonTreePath = document.querySelectorAll ('.elJsonTreePath');
        let elJsonTree = document.getElementById('elJsonTree');

        //JSON.stringify(eval('('+str+')'));
        let json = JSON.stringify(this.code);
        var obj = JSON.parse(this.code);
        console.log(obj);
        
        JPP.jsonPathPicker (elJsonTree, obj, elJsonTreePath,  {
            outputCollapsed: false,     // Все узлы свернуты.
            outputWithQuotes: false,    // Все ключи в выходном HTML заключены в двойные кавычки. Например. {"foobar": 1} вместо {foobar: 1}.
            pathNotation: 'dots',       // Тип обозначения пути. Допускается dots обозначение точек (например example.in.dots.notation) и brackets скобок (например ['example']['in']['brackets']['notation']).
            pathQuotesType: 'double'    // single
        });
    }

    onJsonFormatter() {
        let elTextareaJsonCode = document.getElementById('elTextareaJsonCode');
        this.code = elTextareaJsonCode.value;
        this.code = beautify(this.code, { indent_size: 2, space_in_empty_paren: true });
        elTextareaJsonCode.value = this.code;
    }

    jsonCode() {
        this.openJsonCode();
    }

    jsonTree() {
        this.openJsonTree();
    }

}


module.exports = JsonFormatter;