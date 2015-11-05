var ying = require('../lib/main');
var assert = require('assert');
var util = require('util');

var specIndex = 1;
var specGroupIndex = 1;

function run_spec(desc, func, pas, result) {
    it(util.format('spec(%d) group(%d) %s', specIndex, specGroupIndex, desc), function () {
        assert.equal(func(pas), result);
        specIndex++;
    });
}

describe('ying test', function() {

    var specData = [
        {
            src: '<p>{{name}}</p>',
            pas: [{name: 'Mgen >>>'}, '', null],
            exp: ['<p>Mgen &gt;&gt;&gt;</p>', '<p></p>', '<p></p>']
        },
        {
            src: '<p>{{= _e(d.id ? d.id + "~" + d.name : d.error) }}</p>',
            pas: [{id: 123, name: 'Mgen >>>'}, {error: 'Fun with ying'}],
            exp: ['<p>123~Mgen &gt;&gt;&gt;</p>', '<p>Fun with ying</p>']
        },
        {
            src: '<ul>{{# var s = ""; for(var i in d.users) s += "<li>" + _e(d.users[i]) + "</li>"; return s; }}</ul>',
            pas: [{users: ['aaa', 'b', 'cccc', 'dd']}],
            exp: ['<ul><li>aaa</li><li>b</li><li>cccc</li><li>dd</li></ul>']
        },
        {
            src: '<body>{{= d.content }}</body>',
            pas: [{content: '<h1>hello</h1>'}],
            exp: ['<body><h1>hello</h1></body>']
        },
        {
            src: '<p>{{=_e(d.id ? d.id + "~" + d.name : d.error)}}</p>',
            pas: [{id: 123, name: 'Mgen >>>'}, {error: 'Fun with ying'}],
            exp: ['<p>123~Mgen &gt;&gt;&gt;</p>', '<p>Fun with ying</p>']
        },
        {
            src: '<ul>{{#var s = ""; for(var i in d.users) s += "<li>" + _e(d.users[i]) + "</li>"; return s;}}</ul>',
            pas: [{users: ['aaa', 'b', 'cccc', 'dd']}],
            exp: ['<ul><li>aaa</li><li>b</li><li>cccc</li><li>dd</li></ul>']
        },
        {
            src: '<body>{{=d.content}}</body>',
            pas: [{content: '<h1>hello</h1>'}],
            exp: ['<body><h1>hello</h1></body>']
        },
        {
            src: ' {{a}} ',
            pas: [{a: 'a'}],
            exp: [' a ']
        },
        {
            src: '{{a}} ',
            pas: [{a: 'a'}],
            exp: ['a ']
        },
        {
            src: '{{=d.a}} ',
            pas: [{a: 'a'}],
            exp: ['a ']
        },
        {
            src: '{{=d.flag\n?\n"true"\n:\n"false"}}',
            pas: [{}],
            exp_s: ['{{=d.flag\n?\n"true"\n:\n"false"}}'],
            exp_m: ['false'],
            multiline: true
        }
    ];

    specData.forEach(function (specItem) {
        var func_s = ying.compile(specItem.src);
        var func_m = ying.compile(specItem.src, {multiline: true});

        specItem.pas.forEach(function (pasItem, index) {
            var exp_s, exp_m;
            if (specItem.multiline) {
                exp_s = specItem.exp_s;
                exp_m = specItem.exp_m;
            } else {
                exp_s = exp_m = specItem.exp;
            }

            // run singleline tests
            run_spec('singleline', func_s, pasItem, exp_s[index]);
            // run multiline tests
            run_spec('multiline', func_m, pasItem, exp_m[index]);

            specGroupIndex++;
        });
    });
});
