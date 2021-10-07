const path = require('path');
const url = require('url');
const db = require('electron-db');

var obConfig = {
    tableSettings: 'settings',
}

var obDataBase = {

    init: (function(){
        db.createTable(obConfig.tableSettings, (succ, msg) => {
            if (!succ) {
              console.log('An error has occured. ' + msg)
            }
        })
        if (db.valid(obConfig.tableSettings)) {

            db.getRows(obConfig.tableSettings, {
                name: "stage.vodohod.com"
            }, (succ, result) => {
                if(succ && !result.length) {
                    let obj = new Object();
                    obj.name = "stage.vodohod.com";
                    obj.link = "https://stage.vodohod.com/test_scripts/git.php";
                    db.insertTableContent(obConfig.tableSettings, obj, (succ2, msg) => {})
                }
            })   
            
            
        }
    })()
};

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
        let elBranchSite = document.querySelector('#elBranchSite');
        let elBranchSiteStatus = document.querySelector('#elBranchSiteStatus');

        var formData = new FormData();
        let promise = obRequest.postData(obRequest.urlStageSite, formData);
        promise.then(
            result => {
                if(result.branch_site)
                elBranchSite.innerHTML = result.branch_site;
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

        elBranchSiteStatus.innerHTML = formatter.format(today);
    },
    
    onCheckoutBranch:function() {
        
    },

    init: (function(){

        let elWrapper = document.querySelector('#elWrapper');

        if (db.valid(obConfig.tableSettings)) {
            db.getAll(obConfig.tableSettings, (succ, data) => {
                if(succ && data.length) {
                    data.forEach(element => {
                        let item = document.createElement('div');
                        item.innerHTML = `<div class="branchesStatuses">
                                            <div class="row">
                                            <div class="col-5">${element.name}</div>
                                            <div class="col-7">
                                                <div id="elBranchSiteStatus" class="branch_site_status">Обновление...</div>
                                            </div>
                                            </div> 
                                            <div class="row" style="margin-top: 10px;">
                                            <div class="col-12">Ветка: <span id="elBranchSite" class="v-branch">...</span>
                                                <button onclick="obBranches.onCheckoutBranch();" class="v-btn btn" style="margin-left: 10px;">Переключить</button>
                                            </div>
                                            </div>
                                        </div>`;

                        elWrapper.append(item);
                    });
                    
                }
            })
        }

        let timerId = setInterval(() => {
            obBranches.onSyncBranches();
        }, 60000);
    })()
};

window.addEventListener('DOMContentLoaded', () => {
    obBranches.onSyncBranches();
})
