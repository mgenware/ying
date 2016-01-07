var ying = require('../lib/main');
var assert = require('assert');
var util = require('util');

var specIndex = 1;
var specGroupIndex = 1;

function run_spec(func, pas, result) {
    it(util.format('spec(%d) group(%d)', specIndex, specGroupIndex), function () {
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
            exp: ['false']
        },
        {
            src: `{{# let res = '';
            if (d.flag) {
                res += '1';
                if (d.flag2) {
                    res += '2';
                }
            }
            return res;
         }}`,
            pas: [{flag: 1, flag2: 1}, null, {flag: 1}, {flag2: 1}],
            exp: ['12', '', '1', '']
        },
        {
            src: '{{a}} {{=d.a}}',
            pas: [{a: '/\\"\'<> \t&'}],
            exp: ['/\\&quot;&#39;&lt;&gt; \t&amp; /\\"\'<> \t&']
        },
        {
            src: '{{~ if(d.flag){ }}{{= _e(d.trueValue)}}{{~ }else{ }}{{falseValue}}{{~ } }}',
            pas: [{flag: true, trueValue: '<true>', falseValue: '<false>'}, {trueValue: '<true>', falseValue: '<false>'}],
            exp: ['&lt;true&gt;', '&lt;false&gt;']
        },
        {
            src: `{{~ if(d.root){ }}1{{~ if(d.nested){ }}2{{~ } }}{{~ } }}`,
            pas: [{root: true}, {root: true, nested: true}, {}, {nested: true}],
            exp: ['1', '12', '', '']
        }
    ];

    specData.forEach(function (specItem) {
        var func = ying.compile(specItem.src);
        var exp = specItem.exp;

        specItem.pas.forEach(function (pasItem, index) {
            run_spec(func, pasItem, exp[index]);

            specGroupIndex++;
        });
    });
});
