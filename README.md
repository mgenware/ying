# ying

[![npm version](https://badge.fury.io/js/ying.svg)](https://badge.fury.io/js/ying)
[![Node.js Version](http://img.shields.io/node/v/ying.svg)](https://nodejs.org/en/)
[![Build Status](https://travis-ci.org/mgenware/ying.svg?branch=master)](http://travis-ci.org/mgenware/ying)
[![NPM Downloads](https://img.shields.io/npm/dm/ying.svg)](https://www.npmjs.org/package/ying)


Another simple Node.js template engine, requires Node.js 4.0 or higher.

## Installation
```
npm install ying
```

## Run tests
```
npm test
```
*This project is tested on Node.js 4.1.1*

# Usage
* `ying.compile(templateStr, opt)` compiles a template string to a JavaScript function. Available options:
    * `logging` if true, show debugging logs on standard output.

* `{{xxx}}` reference a property named 'xxx' and escape its value for HTML.

Example:
```javascript
var ying = require('ying');

var func = ying.compile('<p>{{name}}</p>');
console.log(func({name: 'Mgen >>>'}));
```

Output:
```html
<p>Mgen &gt;&gt;&gt;</p>
```


* `{{= }}` embeds a JavaScript expression inside template string.
* `d.<property>` references properties in user argument(so `d` is a reserved word inside template JavaScript expressions).
* `_e(str)` use this to escape string for HTML inside template(so `_e` is a reserved word inside template JavaScript expressions).

Example:
```javascript
var ying = require('ying');

// Embeds a JavaScript expression (use d to reference arguments, _e(str) to escape string for HTML))
var func = ying.compile('<p>{{= _e(d.id ? d.id + "~" + d.name : d.error) }}</p>');
console.log(func({id: 123, name: 'Mgen >>>'}));
console.log(func({error: 'Fun with ying'}));
```

Output:
```html
<p>123~Mgen &gt;&gt;&gt;</p>
<p>Fun with ying</p>
```


* `{{# }}` defines a mini-function to return something.

Example:
```javascript
var ying = require('ying');

// Embeds a JavaScript function (use d to reference arguments, _e(str) to escape string for HTML))
// Populates an HTML list
var func = ying.compile('<ul>{{# var s = ""; for(var i in d.users) s += "<li>" + _e(d.users[i]) + "</li>"; return s; }}</ul>');
console.log(func({users: ['aaa', 'b', 'cccc', 'dd']}));
```

Output:
```html
<ul><li>aaa</li><li>b</li><li>cccc</li><li>dd</li></ul>
```

# More Examples
## Composite Template(Includes)
ying can also accomplish something like [Jade's Includes](http://jade-lang.com/reference/includes/).
Sample code:
```javascript
var ying = require('ying');

// create 2 template functions
// page_content in parentTemplate will be set by result of childTemplate
var parentTemplate = ying.compile('<html><head><title>{{page_title}}</title><body>{{=d.page_content}}</body></html>');
var childTemplate = ying.compile('<h1>{{name}}</h1><p>{{description}}</p>');

// 2 data object, each for their own template function
function compositeTemplate(parentData, childData) {
    // setting result of childTemplate to parentData.page_content
    parentData.page_content = childTemplate(childData);
    return parentTemplate(parentData);
}

var result = compositeTemplate({page_title: 'Title of this page'}, {name: 'Mgen', description: 'hello'});
console.log(result);
```
Output the full generated HTML:
```html
<html><head><title>Title of this page</title><body><h1>Mgen</h1><p>hello</p></body></html>
```

# ChangeLog
[CHANGELOG.md](CHANGELOG.md)

# License
MIT
