const electron = require('electron');
const remote = require ("electron").remote;
const BrowserWindow = electron.remote.BrowserWindow;
const globalShortcut = electron.remote.globalShortcut;

const path = require('path');
const url = require('url');
const notifier = require('node-notifier');

const prompt = require('electron-prompt');

var beautify = require('js-beautify');
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
                                    <div class='v-json-select'>
                                        <select id='elJsonLanguage'>
                                            <option value='json'>JSON</option>
                                            <option value='javascript'>JavaScript</option>
                                            <option value='css'>CSS</option>
                                            <option value='html'>HTML</option>
                                        </select>
                                    </div>
                                    <textarea id='elTextareaJsonCode'>${this.code}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>`;
        
        elWrapper.innerHTML = htmlCode;

        let elTextareaJsonCode = document.getElementById('elTextareaJsonCode');
        let height =  window.innerHeight - 120;
        elTextareaJsonCode.setAttribute("style",`height:${height}px`);
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
                                <div class='v-json-tree' id='elJsonTree'></div>
                            </div>
                        </div>
                    </div>`;

        elWrapper.innerHTML = htmlCode;

        let elJsonTree = document.getElementById('elJsonTree');
        let height =  window.innerHeight - 120;
        elJsonTree.setAttribute("style",`height:${height}px`);

        this.pathPicker();
    }

    pathPicker()
    {
        if(this.code) {
            let elJsonTreePath = document.querySelectorAll ('.elJsonTreePath');
            let elJsonTree = document.getElementById('elJsonTree');

            var json = JSON.parse(this.code);

            JPP.jsonPathPicker (elJsonTree, json, elJsonTreePath,  {
                outputCollapsed: false,     // Все узлы свернуты.
                outputWithQuotes: false,    // Все ключи в выходном HTML заключены в двойные кавычки. Например. {"foobar": 1} вместо {foobar: 1}.
                pathNotation: 'dots',       // Тип обозначения пути. Допускается dots обозначение точек (например example.in.dots.notation) и brackets скобок (например ['example']['in']['brackets']['notation']).
                pathQuotesType: 'double'    // single
            });
        }
    }

    onJsonFormatter() {
        let elTextareaJsonCode = document.getElementById('elTextareaJsonCode');
        this.code = elTextareaJsonCode.value;

        let elJsonLanguage = document.getElementById('elJsonLanguage');
        
        let language = elJsonLanguage.value;
        let beautifyCode = beautify.js;
        let indentSize = 2;
        switch(language) {
            case 'json':
                beautifyCode = beautify.js;
                indentSize = 8;
                break;
            case 'javascript':
                beautifyCode = beautify.js;
                indentSize = 4;
                break;
            case 'css':
                beautifyCode = beautify.css;
                break;
            case 'html':
                beautifyCode = beautify.html;
                break;
        }

        this.code = beautifyCode(this.code, { 
            indent_size: indentSize, 
            space_in_empty_paren: true,
            indent_with_tabs: false, 
            brace_style: "collapse",
            "html": {
                "end_with_newline": true,
                "js": {
                    "indent_size": 2
                },
                "css": {
                    "indent_size": 2
                }
            },
            "css": {
                "indent_size": 1
            },
            "js": {
               "preserve-newlines": true
            }
        });
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