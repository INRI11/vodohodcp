const electron = require('electron');
const remote = require ("electron").remote;
const BrowserWindow = electron.remote.BrowserWindow;
const globalShortcut = electron.remote.globalShortcut;

const path = require('path');
const url = require('url');
const notifier = require('node-notifier');

const prompt = require('electron-prompt');

let mainWindow = remote.getCurrentWindow ();
let siteWindow;

class Authorize {
    constructor() {
        // default
    }

    setOptions(platform='prod') {
        this.platform = platform;

        switch(platform) {
            case 'prod':

                this.crs_url = 'https://api-crs.vodohod.com/';
                this.site_url = 'https://vodohod.com';

                break;
            case 'stage':
                
                this.crs_url = 'https://api-crs-stage.vodohod.com/';
                this.site_url = 'https://stage.vodohod.com';

                break;
        }

        this.method_security_authorise = this.crs_url+'security/authorise';
        this.method_security_authorise_as = this.crs_url+'security/authorise-as';
        this.method_users_check_email = this.crs_url+'ru/users/check-email';
    }

    async request(url, data, headers = {}) {
        return await fetch(url, {
            method: 'POST',
            headers: headers,
            body: data
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
        }).catch(error => {
            return error;
        })
    }

    selectPlatform() {
        prompt({
            title: 'Авторизация под пользователем',
            label: 'Выберите на каком контуре авторизоваться:',
            selectOptions: {
                'prod': 'vodohod.com',
                'stage': 'stage.vodohod.com',
            },
            type: 'select',
            buttonLabels: {
                'ok': 'Принять',
                'cancel': 'Отменить',
            },
            height: 200
        })
        .then((platform) => {
            if(platform) {
                this.setOptions(platform);
                this.inputEmail();
            }
        });
    }

    inputEmail() {
        prompt({
            title: 'Авторизация под пользователем',
            label: 'Введите Email пользователя в CRS:',
            value: '',
            inputAttrs: {
                type: 'email'
            },
            type: 'input',
            buttonLabels: {
                'ok': 'Авторизовться',
                'cancel': 'Отменить',
            },
            height: 200
        })
        .then((email) => {
            if(email) {
                this.methodAuthorize(email);
            } else {
                //alert("Вы забыли ввести Email.");
            }
        });
    }

    methodAuthorize(email) {
        var formData = new FormData();
        formData.append('login', 'dev.null@studiofact.ru');
        formData.append('password', 'sDn>WrKpBipQSLCQeecj01');

        let promise = this.request(this.method_security_authorise, formData);

        promise.then(
            response => {
                if(response.message == "OK") {
                    let accessToken = response.result.accessToken.token;
                    let refreshToken = response.result.refreshToken.token;

                    if(accessToken) {
                        this.methodCheckEmail(email, accessToken);
                    }
                }
            },
            error => {
                console.log(error);
            }
        );
        
    }

    methodCheckEmail(email, token) {
        var formData = new FormData();
        formData.append('email', email);

        let promise = this.request(this.method_users_check_email, formData, {
            'Authorization': `Bearer ${token}`
        });

        promise.then(
            response => {
                if(response.result == "OK") {
                    if(response.data.id) {
                        this.methodAuthoriseAs(response.data.id, token);
                    } else {
                        alert('Email не найден: Метод users/check-email');
                    }
                } else {
                    alert('Не известная ошибка: Метод users/check-email');
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    methodAuthoriseAs(userID, token) {
        var formData = new FormData();
        formData.append('userID', userID);

        let promise = this.request(this.method_security_authorise_as, formData, {
            'Authorization': `Bearer ${token}`
        });

        promise.then(
            response => {
                if(response.message == "OK") {
                    let accessToken = response.result.accessToken.token;
                    let refreshToken = response.result.refreshToken.token;
                    
                    if( accessToken ) {
                        this.createWindow(accessToken, refreshToken);
                    } else {
                        alert('Авторизоваться не удалось: Метод security/authorise-as');
                    }
                } else {
                    alert('Не известная ошибка: Метод security/authorise-as');
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    createWindow(accessToken, refreshToken) {
        siteWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            show: false,
            //backgroundColor: '#2e2c29',
            webPreferences: {
                partition: 'persist:partitionOne', // подключаем индивидуальную сессию 
            }
        })

        let mainSession = siteWindow.webContents.session; 

        const cookieAccessToken = { url: this.site_url, domain: '.vodohod.com', name: 'user_token', value: accessToken }
        mainSession.cookies.set(cookieAccessToken);
        const cookieRefreshToken = { url: this.site_url, domain: '.vodohod.com', name: 'user_refresh_token', value: refreshToken }
        mainSession.cookies.set(cookieRefreshToken);
    
        siteWindow.loadURL(this.site_url);
        
        siteWindow.once('ready-to-show', () => {
            siteWindow.show()
        })
    
        // MacOS
        globalShortcut.register('CommandOrControl+I', () => {
            siteWindow.webContents.openDevTools();
        })
        // Win
        globalShortcut.register('Ctrl+I', () => {
            siteWindow.webContents.openDevTools();
        })

        siteWindow.on('closed', () => {
            siteWindow = null;
        });

        siteWindow.setMenuBarVisibility(false)
    }

    open() { 
        this.selectPlatform();
    }
}

module.exports = Authorize;