var ying = require('../lib/main');
var assert = require('assert');

describe('ying test', function() {

    var specData = [
        {
            src: '<p>{{name}}</p>',
            pas: [{name: 'Mgen >>>'}],
            exp: ['<p>Mgen &gt;&gt;&gt;</p>']
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
        }
    ];

    var i = 1;
    specData.forEach(function (specItem) {
        var func = ying.compile(specItem.src);
        specItem.pas.forEach(function (pasItem, index) {
            it('spec ' + i++, function () {
                assert.equal(func(pasItem), specItem.exp[index]);
            });
        });
    });
});
