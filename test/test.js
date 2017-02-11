var ying = require('../lib/main');
var assert = require('assert');

function run_spec(func, pas, result, name, groupIndex, specIndex) {
  it(`Group(${groupIndex}) "${name}"(${specIndex})`, function () {
    assert.equal(func(pas), result);
  });
}

describe('ying test', function() {

  var specData = [
    {
      n: '{{ }} | HTML encoding',
      src: '<p>{{name}}</p>',
      pas: [{name: 'Mgen >>>'}, '', null],
      exp: ['<p>Mgen &gt;&gt;&gt;</p>', '<p></p>', '<p></p>']
    },
    {
      n: '{{= }} | _e()',
      src: '<p>{{= _e(d.id ? d.id + "~" + d.name : d.error) }}</p>',
      pas: [{id: 123, name: 'Mgen >>>'}, {error: 'Fun with ying'}],
      exp: ['<p>123~Mgen &gt;&gt;&gt;</p>', '<p>Fun with ying</p>']
    },
    {
      n: '{{# }} with whitespaces inside',
      src: '<ul>{{# var s = ""; for(var i in d.users) s += "<li>" + _e(d.users[i]) + "</li>"; return s; }}</ul>',
      pas: [{users: ['aaa', 'b', 'cccc', 'dd']}],
      exp: ['<ul><li>aaa</li><li>b</li><li>cccc</li><li>dd</li></ul>']
    },
    {
      n: '{{= }} with whitespaces inside',
      src: '<body>{{= d.content }}</body>',
      pas: [{content: '<h1>hello</h1>'}],
      exp: ['<body><h1>hello</h1></body>']
    },
    {
      n: '{{= }} | _e',
      src: '<p>{{=_e(d.id ? d.id + "~" + d.name : d.error)}}</p>',
      pas: [{id: 123, name: 'Mgen >>>'}, {error: 'Fun with ying'}],
      exp: ['<p>123~Mgen &gt;&gt;&gt;</p>', '<p>Fun with ying</p>']
    },
    {
      n: '{{# }} | _e',
      src: '<ul>{{#var s = ""; for(var i in d.users) s += "<li>" + _e(d.users[i]) + "</li>"; return s;}}</ul>',
      pas: [{users: ['aaa', 'b', 'cccc', 'dd']}],
      exp: ['<ul><li>aaa</li><li>b</li><li>cccc</li><li>dd</li></ul>']
    },
    {
      n: '{{= }}',
      src: '<body>{{=d.content}}</body>',
      pas: [{content: '<h1>hello</h1>'}],
      exp: ['<body><h1>hello</h1></body>']
    },
    {
      n: '{{ }} with whitespaces outside',
      src: ' {{a}} ',
      pas: [{a: 'a'}],
      exp: [' a ']
    },
    {
      n: '{{ }} with whitespaces outside',
      src: '{{a}} ',
      pas: [{a: 'a'}],
      exp: ['a ']
    },
    {
      n: '{{= }} with whitespaces outside',
      src: '{{=d.a}} ',
      pas: [{a: 'a'}],
      exp: ['a ']
    },
    {
      n: '{{= }} with newlines',
      src: '{{=d.flag\n?\n"true"\n:\n"false"}}',
      pas: [{}],
      exp: ['false']
    },
    {
      n: '{{# }} with newlines',
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
      n: '{{ }} | {{= }}',
      src: '{{a}} {{=d.a}}',
      pas: [{a: '/\\"\'<> \t&'}],
      exp: ['/\\&quot;&#39;&lt;&gt; \t&amp; /\\"\'<> \t&']
    },
    {
      n: '{{~ }} | if-else',
      src: '{{~ if(d.flag){ }}{{= _e(d.trueValue)}}{{~ }else{ }}{{falseValue}}{{~ } }}',
      pas: [{flag: true, trueValue: '<true>', falseValue: '<false>'}, {trueValue: '<true>', falseValue: '<false>'}],
      exp: ['&lt;true&gt;', '&lt;false&gt;']
    },
    {
      n: '{{~ }} | Nested if-else',
      src: '{{~ if(d.root){ }}1{{~ if(d.nested){ }}2{{~ } }}{{~ } }}',
      pas: [{root: true}, {root: true, nested: true}, {}, {nested: true}],
      exp: ['1', '12', '', '']
    },
    {
      n: '{{ }} with unspecified properties',
      src: '{{a}}{{b}}{{c}}',
      pas: [{}, {b: 123}],
      exp: ['', '123']
    },
    {
      n: 'Nested properties',
      src:'{{client.os.name}}',
      pas: [{client: {os: {name: 'linux'}}}],
      exp: ['linux']
    }
  ];

  var groupIndex = 1;
  specData.forEach(function (specItem) {
    var specIndex = 1;
    var func = ying.compile(specItem.src);
    var exp = specItem.exp;
    var name = specItem.n;

    specItem.pas.forEach(function (pasItem, index) {
      run_spec(func, pasItem, exp[index], name, groupIndex, specIndex);
      specIndex++;
    });

    groupIndex++;
  });
});
