const path = require('path');
const url = require('url');
const notifier = require('node-notifier');

const Authorize = require("./authorize.js");
const JsonFormatter = require("./jsonformatter.js");
const Branches = require("./branches.js");


let currentPage;
let authorize = new Authorize();
let jsonFormatter  = new JsonFormatter();
let branches = new Branches();

const onAuthorize = () => {
    authorize.open();
}

const onJsonFormatter = () => {
    jsonFormatter.open();
    currentPage = 'json';
}

const onBranches = () => {
    branches.open();
    currentPage = 'branch';
}

const onJsonCode = () => {
    jsonFormatter.jsonCode();
}

const onJsonTree = () => {
    jsonFormatter.jsonTree();
}

const onJsonCodeFormatter = () => {
    jsonFormatter.onJsonFormatter();
}

const onBranchSwitch = (url) => {
    branches.switchBranch(url);
}



window.addEventListener('DOMContentLoaded', () => {
    branches.open();

    let timerId = setInterval(() => {
        branches.sync();
    }, 60000);
})
