'use strict';

let Promise = require('bluebird');

let fs = require('fs');
let path = require('path');
let http = require('http');

module.exports = function(){
    Promise.try(function(){
        return fs.readFileSync(path.resolve(process.cwd(),'boimap-config.json'));
    }).then((stat)=>{
        console.log(stat);
    }).catch((err)=>{
        throw err;
    })
};
