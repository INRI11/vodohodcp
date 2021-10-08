const path = require('path');
const url = require('url');

var obConfig = {
    projects: [
        { id: 1, name: "stage.vodohod.com", url: 'https://stage.vodohod.com/git.php'},
        { id: 2, name: "stage.booking.vodohod.com", url: 'https://stage.booking.vodohod.com/git.php'}
    ]
}

var obRequest = {
    urlStageSite: 'https://stage.vodohod.com/test_scripts/git.php',
    token: 'controlpanel',

    postData: async function(url = '', data) {
        data.append('token', obRequest.token)

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
};

var obBranches = {   
    onSyncBranches: function() {
        let projects = obConfig.projects;
        if(projects.length) {
            projects.forEach(element => {
                let elBranchName = document.querySelector('#elBranchName'+element.id);
                let elBranchStatus = document.querySelector('#elBranchStatus'+element.id);

                var formData = new FormData();
                formData.append('method', 'get_branch');
                let promise = obRequest.postData(element.url, formData);
                promise.then(
                    result => {
                        if(result.branch_site)
                        elBranchName.innerHTML = result.branch_site;
                    },
                    error => {
                        console.log(error);
                    }
                );
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
            });
        }
    },
    
    onSwitchBranch:function(url) {
        var sBranch = '';
        var formData = new FormData();
        formData.append('method', 'get_branch');
        let promise = obRequest.postData(url, formData);
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
                    let promise = obRequest.postData(url, formData);
                    promise.then(
                        result => {
                            obBranches.onSyncBranches();
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
    },

    init: (function(){
        let timerId = setInterval(() => {
            obBranches.onSyncBranches();
        }, 60000);

        let projects = obConfig.projects;

        if(projects.length) {
            let elWrapper = document.querySelector('#elWrapper');
            projects.forEach(element => {
                let item = document.createElement('div');
                item.innerHTML = `<div class="branchesStatuses">
                                    <div class="row">
                                    <div class="col-5">${element.name}</div>
                                    <div class="col-7">
                                        <div id="elBranchStatus${element.id}" class="branch_site_status">Обновление...</div>
                                    </div>
                                    </div> 
                                    <div class="row" style="margin-top: 10px;">
                                    <div class="col-12">Ветка: <span id="elBranchName${element.id}" class="v-branch">...</span>
                                        <button onclick="obBranches.onSwitchBranch('${element.url}');" class="v-btn btn" style="margin-left: 10px;">Переключить</button>
                                    </div>
                                    </div>
                                </div>`;
    
                elWrapper.append(item);
            });
        }
    })()
};

window.addEventListener('DOMContentLoaded', () => {
    obBranches.onSyncBranches();
})
