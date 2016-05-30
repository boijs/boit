'use strict';

let Promise = require('bluebird');

let fs = require('fs');
let path = require('path');
let http = require('http');

const REG_JS = /\.js$/;
const REG_CSS = /\.css$/;
const REG_SRC = /src\s?=\s?(\'|\")[\.A-Za-z0-9_\/]*[\w\.]+\.js(\'|\")/g;
const REG_HREF = /href\s?=\s?(\'|\")[\.A-Za-z0-9_\/]*[\w\.]+\.css(\'|\")/g;


function replaceUrl(mapping,htmls){
    let mapping_js = mapping.js,
    mapping_style = mapping.style;
    let arr_js = [],arr_style = [];


    Object.keys(mapping_js).map(function(key){
        arr_js.push({
            regDel: new RegExp('src\\s?=\\s?(\'|\")[\\.A-Za-z0-9_\\/]*'+key+'(\'|\")','g'),
            regRep: new RegExp('boi\\-js\\s*=\\s*(\'|\")\\s*'+key+'\\s*(\'|\")'),
            target: ['src=\'',mapping_js[key],'\''].join('')
        });
    });

    Object.keys(mapping_style).map(function(key){
        arr_style.push({
            regDel: new RegExp('href\\s?=\\s?(\'|\")[\\.A-Za-z0-9_\\/]*'+key+'(\'|\")','g'),
            regRep: new RegExp('boi\\-css\\s*=\\s*(\'|\")\\s*'+key+'\\s*(\'|\")'),
            target: ['href=\'',mapping_style[key],'\''].join('')
        });
    });

    htmls.map(function(html){
        Promise.try(()=>{
            return fs.readFileSync(path.resolve(process.cwd(),html));
        }).then((content)=>{
            let _content = content.toString();
            arr_js.map((js)=>{
                _content = _content.replace(js.regDel,'');
                _content = _content.replace(js.regRep,js.target);
            });
            arr_style.map((style)=>{
                _content = _content.replace(style.regDel,'');
                _content = _content.replace(style.regRep,style.target);
            });
            return _content;
        }).then((content)=>{
            return fs.writeFileSync(path.resolve(process.cwd(),'../',html));
        }).catch((err) => {
            throw err;
        })
    });
}

module.exports = function() {
    let mapping = null;
    Promise.try(function() {
        return fs.readFileSync(path.resolve(process.cwd(), 'boimap-config.json'));
    }).then((content) => {
        let config = JSON.parse(content);
        let _mapfile = config.mapfile;
        let _targets = config.targets;
        http.get(_mapfile, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                mapping = JSON.parse(chunk);
                replaceUrl(mapping,_targets);
            });
        });
    }).catch((err) => {
        throw err;
    })
};
