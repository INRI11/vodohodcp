const electron = require('electron');
const remote = require ("electron").remote;
const BrowserWindow = electron.remote.BrowserWindow;
const globalShortcut = electron.remote.globalShortcut;

const path = require('path');
const url = require('url');
const notifier = require('node-notifier');
const modal = require('electron-modal-window');

const prompt = require('electron-prompt');

class Branches {

    constructor() {
        // default
        this.token = 'controlpanel';
        this.projects = [
            { id: 1, name: "stage.vodohod.com", url: 'https://stage.vodohod.com/git.php'},
            { id: 2, name: "stage.booking.vodohod.com", url: 'https://stage.booking.vodohod.com/git.php'}
        ];
    }

    async post (url = '', data) {
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

    sync() {
        let projects = this.projects;
        if(projects.length) {
            projects.forEach((project, i) => {
                let elBranchName = document.querySelector('#elBranchName'+project.id);
                let elBranchStatus = document.querySelector('#elBranchStatus'+project.id);

                var formData = new FormData();
                formData.append('method', 'get_branch');
                let promise = this.post(project.url, formData);
                promise.then(
                    result => {
                        if(result.branch_site) {
                            if(elBranchName)
                                elBranchName.innerHTML = result.branch_site;

                            if ("branch" in project && project.branch != result.branch_site) {
                                const options = {
                                    title: project.name,
                                    message: 'Ветка сменилась на '+result.branch_site,
                                    sound: false, 
                                    icon: 'Terminal Icon', 
                                };
                        
                                new notifier.WindowsToaster({
                                    withFallback: false,
                                }).notify(options);
                            } 
                            projects[i].branch = result.branch_site;
                        }
                    },
                    error => {
                        console.log(error);
                    }
                );
                if(elBranchStatus) {
                    var today  = new Date();
                    let formatter = new Intl.DateTimeFormat("ru", {
                        weekday:    "long",
                        year:       "numeric",
                        month:      "long",
                        day:        "numeric",
                        hour:       "numeric",
                        minute:     "numeric"
                    });
                    elBranchStatus.innerHTML = formatter.format(today);
                }
            });
        }
    }

    switchBranch(url) {
        var sBranch = '';
        var formData = new FormData();
        formData.append('method', 'get_branch');
        let promise = this.post(url, formData);
        promise.then(
            result => {
                if(result.branch_site) {
                    sBranch = result.branch_site;
                    switch(sBranch) {
                        case 'stage':
                            sBranch = 'stage_extyl';
                            break;
                        case 'stage_extyl':
                            sBranch = 'stage';
                            break;
                    }
        
                    var formData = new FormData();
                    formData.append('method', 'switch_branch');
                    formData.append('branch', sBranch);
                    let promise = this.post(url, formData);
                    promise.then(
                        result => {
                            this.sync();
                        },
                        error => {
                            console.log(error);
                        }
                    );
                }
                    
            },
            error => {
                console.log(error);
            }
        );
    }

    gitLogs(url) {
        var formData = new FormData();
        formData.append('method', 'git_logs');
        let promise = this.post(url, formData);
        promise.then(
            result => {
                if(result.logs.length) {
                    let line = '';
                    for (let index = 0; index < result.logs.length; index++) {
                        line += `<p>${result.logs[index]}</p>`;
                    }

                    const modalWindow = modal.createModal( path.join(__dirname, '/modal.html'), {
                        width: 700,
                        height: 500,
                        resizable: false, 
                        //movable: false,
                        autoHideMenuBar: true,
                        webPreferences: {
                            nodeIntegration: true
                        },
                        frame: true
                    })

                    modalWindow.on('title', function (cb) {
                        cb(null, 'Последние 3 коммита')
                    })
                
                    modalWindow.on('body', function (cb) {
                        cb(null, line)
                    })
                } 
            },
            error => {
                console.log(error);
            }
        );
    }

    gitStatus(url) {
        var formData = new FormData();
        formData.append('method', 'git_status');
        let promise = this.post(url, formData);
        promise.then(
            result => {
                if(result.status.length) {
                    let line = '';
                    for (let index = 0; index < result.status.length; index++) {
                        let text = result.status[index];
                        text = text.replace("On branch", "Текущая ветка");
                        text = text.replace("Your branch is up to date with", "В вашей ветке установлена последняя версия");
                        text = text.replace("Changes not staged for commit", "Изменения, не предназначенные для коммита");
                        text = text.replace("nothing to commit, working tree clean", "нечего коммитить, рабочее дерево чистое");
                        text = text.replace("nothing added to commit but untracked files present", "ничего не добавлено для коммита, но присутствуют неотслеживаемые файлы");
                        line += `<p style='padding: 3px 0px; margin: 0px;'>${text}</p>`;
                    }

                    const modalWindow = modal.createModal( path.join(__dirname, '/modal.html'), {
                        width: 700,
                        height: 500,
                        resizable: false, 
                        //movable: false,
                        autoHideMenuBar: true,
                        webPreferences: {
                            nodeIntegration: true
                        },
                        frame: true
                    })
                
                    modalWindow.on('body', function (cb) {
                        cb(null, line)
                    })
                } 
            },
            error => {
                console.log(error);
            }
        );
    }

    open() {
        let elWrapper = document.querySelector('#elWrapper');
        elWrapper.innerHTML = '';

        let projects = this.projects;

        if(projects.length) {
            projects.forEach(project => {
                let item = document.createElement('div');
                item.innerHTML = `<div class="branchesStatuses">
                                    <div class="row">
                                    <div class="col-5">${project.name}</div>
                                    <div class="col-7">
                                        <div id="elBranchStatus${project.id}" class="branch_site_status">Обновление...</div>
                                    </div>
                                    </div> 
                                    <div class="row" style="margin-top: 10px;">
                                    <div class="col-12">Ветка: <span id="elBranchName${project.id}" class="v-branch">...</span>
                                        <button onclick="onBranchSwitch('${project.url}');" class="v-btn btn" style="margin-left: 10px;">Переключить</button>
                                        <button onclick="onBranchStatus('${project.url}');" class="v-btn btn" style="margin-left: 10px;">Статус</button>
                                        <button onclick="onBranchLogs('${project.url}');" class="v-btn btn" style="margin-left: 10px;">Коммиты</button>
                                    </div>
                                    </div>
                                </div>`;
    
                elWrapper.append(item);
            });

            this.sync();
        }
    }
}


module.exports = Branches;