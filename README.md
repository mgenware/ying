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

# Quick Start
## Compiling a template
use `ying.compile(templateStr, opt)` to compile a template string into a JavaScript function.
* `templateStr` the template string.
* `opt` available options:
   * `logging` if true, show debugging logs on standard output.

## Getting property values using `{{prop}}`
**Use `{{prop}}` to get a property value and encode its content into valid HTML.**
```javascript
var ying = require('ying');

var func = ying.compile('<p>{{name}}</p>');
console.log(func({name: 'Mgen >>>'}));
```

Output:
```html
<p>Mgen &gt;&gt;&gt;</p>
```

## Embedding a JavaScript Expression using `{{= expr}}`
```js
var ying = require('ying');

var func = ying.compile('{{= "Current date: " + new Date() }}');
console.log(func());
```

Output:
```
Current date: Sun Feb 07 2016 10:12:49 GMT+0800 (CST)
```

**The variable `d` is the user arguments passed to template function.**
```js
var ying = require('ying');

var func = ying.compile('{{= d.name || "<None>"}}');
console.log(func({name: 'Mgen >>>'}));
console.log(func());
```

Output:
```
Mgen >>>
<None>
```

**To escape text for HTML inside expression, use the function `_e(str)`.**
```js
var ying = require('ying');

var func = ying.compile('{{= _e(d.name || "<None>")}}');
console.log(func({name: 'Mgen >>>'}));
console.log(func());
```

Output:
```
Mgen &gt;&gt;&gt;
&lt;None&gt;
```

## Embedding a JavaScript Function using `{{# body}}`
**Populate an HTML list using `for` loops.**
```js
var ying = require('ying');

// Here we use ES6 Template strings which supports multi-line strings
var func = ying.compile(`<ul>{{#
    if (!d.users) {
        return "<li>No users available</li>"
    }
    var result = "";
    for(var user of d.users) {
        result += "<li>" + _e(user) + "</li>";
    }
    return result;
}}</ul>`);
console.log(func({users: ['Mgen', '<ABC>', '123']}));
```

Output:
```
<ul><li>Mgen</li><li>&lt;ABC&gt;</li><li>123</li></ul>
```

## Direct code injection using `{{~ code}}`
**`if-else` code blocks.**
```js
var ying = require('ying');

// Here we use ES6 Template strings which supports multi-line strings
var func = ying.compile(`
    {{~ if(d.os == 'ios') { }}
        <p>You are using iOS</p>
    {{~ } else if(d.os == 'android') { }}
        <p>You are using Android</p>
    {{~ } else { }}
        <p>Unknown OS</p>
    {{~ } }}
`);
console.log(func({os: 'ios'}));
console.log(func({os: 'android'}));
console.log(func({os: 'wp'}));
```

Output:
```
<p>You are using iOS</p>
<p>You are using Android</p>
<p>Unknown OS</p>
```

# More Examples
## Composite Template(Includes)
ying can also accomplish something like [Jade's Includes](http://jade-lang.com/reference/includes/).
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
