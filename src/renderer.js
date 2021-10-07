
/*
import { db } from 'electron-db';
import path from 'path';
*/
/*
const db = require('electron-db');
const path = require('path');
 
// This will save the database in the same directory as the application.
const location = path.join(__dirname, '');

alert(location);
db.createTable('sites', location, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    alert("Success: " + succ);
    console.log("Message: " + msg);
    })
*/

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
        /*
        document.querySelector('#elGetBranches').addEventListener('click', () => {
            obBranches.onSyncBranches();
        })
        */

    })()
};

window.addEventListener('DOMContentLoaded', () => {
    obBranches.onSyncBranches();
})
