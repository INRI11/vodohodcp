const path = require('path');
const url = require('url');

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
        let timerId = setInterval(() => {
            obBranches.onSyncBranches();
        }, 60000);
    })()
};

window.addEventListener('DOMContentLoaded', () => {
    obBranches.onSyncBranches();
})
