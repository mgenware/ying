'use strict';
var jsStringEscape = require('js-string-escape');
var escapeHtml = require('escape-html');

const REGEX_MULTILINE = /{{([\s\S]*?)}}/g;

const TOKEN_TYPE_TEXT = 1;
const TOKEN_TYPE_CMD = 2;

GLOBAL._e = function(t) {
    return escapeHtml(t);
};

function compile(str, opt) {
    opt = opt || {};
    let regex = REGEX_MULTILINE;
    let match = regex.exec(str);
    let idx = 0;
    let tokens = [];
    let text;
    while (match !== null) {
        if (match.index > idx) {
            text = str.substring(idx, match.index);
            tokens.push({ val: text, type: TOKEN_TYPE_TEXT });
        }

        tokens.push({ val: match[1], type: TOKEN_TYPE_CMD });
        idx = match.index + match[0].length;

        match = regex.exec(str);
    }
    if (str.length > idx) {
        text = str.substring(idx, str.length);
        tokens.push({ val: text, type: TOKEN_TYPE_TEXT });
    }

    let funcBody = '"use strict";';
    //d = d || {};
    funcBody += 'd=d||{};';

    if (opt.logging) {
        console.log('--- ying.tokens ---');
        console.log(JSON.stringify(tokens, null, 4));
    }

    funcBody += 'let res="";';
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (token.type === TOKEN_TYPE_TEXT) {
            funcBody += 'res+="' + jsStringEscape(token.val) + '";';
        } else { //type == TOKEN_TYPE_CMD
            let tokenHead = token.val[0];
            switch (tokenHead) {
                case '=':
                    funcBody += 'res+=((' + token.val.substr(1).trim() + ')||"");';
                    break;

                case '#':
                    funcBody += 'res+= ((function(){' + token.val.substr(1).trim() + '})()||"");';
                    break;

                case '~':
                    funcBody += token.val.substr(1).trim();
                    break;

                default:
                    funcBody += 'res+=_e(d.' + token.val.trim() + '||"");';
                    break;
            }
        }
    }
    funcBody += 'return res;';

    if (opt.logging) {
        console.log('--- ying.func ---');
        console.log(funcBody);
    }

    let func = new Function('d', funcBody);
    return func;
}

exports.compile = compile;
