#!/usr/bin/env node

'use strict'

let fs = require('fs');
let path = require('path');
let program = require('commander');

let htmlReplaceUrl = require('./libs/html-replaceurl');

let boit = {};

Object.defineProperty(global, 'boit', {
    enumerable: true,
    writable: false,
    value: boit
});

let info = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

program.version(info.version);
program.usage('<cmd> [option]');

program.command('update [mode]')
    .alias('up')
    .description('update static file urls in specific html')
    .action(function(mode) {
        switch (mode) {
            case 'html':
                htmlReplaceUrl();
                break;
            default:
                break;
        }
    });

program.parse(process.argv);
