const electron = require('electron');
const remote = require ("electron").remote;
const BrowserWindow = electron.remote.BrowserWindow;
const globalShortcut = electron.remote.globalShortcut;

const path = require('path');
const url = require('url');
const notifier = require('node-notifier');

const prompt = require('electron-prompt');

class Branches {

    projects = [
        { id: 1, name: "stage.vodohod.com", url: 'https://stage.vodohod.com/git.php'},
        { id: 2, name: "stage.booking.vodohod.com", url: 'https://stage.booking.vodohod.com/git.php'}
    ];

    token = 'controlpanel';

    constructor() {
        // default
    }

    async postData (url = '', data) {
        data.append('token', this.token)

        return await fetch(url, {
            method: 'POST',
            body: data
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
        }).catch(error => {
            return error;
        })
    }

    open() {

    }
}


module.exports = Branches;