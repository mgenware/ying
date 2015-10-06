# ying
Another simple Node.js template engine.

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
* `ying.compile(templateStr)` compiles a template string to a JavaScript function.  
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
