"use strict";
var util = require('util');
var jsStringEscape = require('js-string-escape');
var fs = require('fs');
var log = console.log;

var regex = /{{(.*?)}}/g;

var TOKEN_TYPE_TEXT = 't';
var TOKEN_TYPE_CMD = 'c';

function compile(str, opt) {
    opt = opt || {};
    var match = regex.exec(str);
    var idx = 0;
    var tokens = [];
    while (match != null) {
        if (match.index > idx) {
            var text = str.substring(idx, match.index);
            tokens.push({ val: text, type: TOKEN_TYPE_TEXT });
        }

        tokens.push({ val: match[1], type: TOKEN_TYPE_CMD });
        idx = match.index + match[0].length;

        match = regex.exec(str);
    }
    if (str.length > idx) {
        var text = str.substring(idx, str.length);
        tokens.push({ val: text, type: TOKEN_TYPE_TEXT });
    }

    var funcBody = '';
    //append internal functions
    funcBody += fs.readFileSync(__dirname + '/funcGenDef.js', { encoding: 'utf8' });
    //d = d || {};
    funcBody += 'd=d||{};';

    if (opt.logging) {
        log('--- tokens ---')
        log(JSON.stringify(tokens, null, 4));
    }

    var isfirst = true;
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (!isfirst) {
            funcBody += '+';
        } else {
            isfirst = false;
            funcBody += 'return ';
        }

        if (token.type == TOKEN_TYPE_TEXT)
            funcBody += '"' + jsStringEscape(token.val).trim() + '"';
        else { //type == TOKEN_TYPE_CMD
            var tokenHead = token.val[0];
            if (tokenHead == '=') {
                funcBody += '((' + token.val.substr(1).trim() + ')||"")';
            } else if (tokenHead == '#') {
                funcBody += '((function(){' + token.val.substr(1).trim() + '})()||"")';
            } else {
                funcBody += '_e(d.' + token.val.trim() + '||"")';
            }
        }
    }
    funcBody += ';';

    if (opt.logging) {
        log('--- func ---');
        log(funcBody);
    }

    var func = new Function('d', funcBody);
    return func;
}

exports.compile = compile;