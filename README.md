# ying
Another simple Node.js template engine.

# Examples
`ying.compile`: compile a template string to a JavaScript function.  
`{{xxx}}`: reference a value named 'xxx' and auto escape this string for HTML.

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


`{{= }}`: Embeding a JavaScript expression directly (you can use `d` to reference arguments and `_e(str)` to escape string for HTML).

Example:
```javascript
var ying = require('ying');

// Embeding a JavaScript expression (using d to reference arguments, _e(str) to escape string for HTML))
var func = ying.compile('<p>{{= _e(d.id ? d.id + "~" + d.name : d.error) }}</p>');
console.log(func({id: 123, name: 'Mgen >>>'}));
console.log(func({error: 'Fun with ying'}));
```

Output:
```html
<p>123~Mgen &gt;&gt;&gt;</p>
<p>Fun with ying</p>
```

`{{# }}`: define a mini-function to return something.

Example:
```javascript
var ying = require('ying');

// Embeding a JavaScript function (using d to reference arguments, _e(str) to escape string for HTML))
// Populating a HTML list
var func = ying.compile('<ul>{{# var s = ""; for(var i in d.users) s += "<li>" + _e(d.users[i]) + "</li>"; return s; }}</ul>');
console.log(func({users: ['aaa', 'b', 'cccc', 'dd']}));
```

Output:
```html
<ul><li>aaa</li><li>b</li><li>cccc</li><li>dd</li></ul>
```
