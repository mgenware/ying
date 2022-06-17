# ying

[![Build Status](https://github.com/mgenware/ying/workflows/Build/badge.svg)](https://github.com/mgenware/ying/actions)
[![npm version](https://img.shields.io/npm/v/ying.svg?style=flat-square)](https://npmjs.com/package/ying)
[![Node.js Version](http://img.shields.io/node/v/ying.svg?style=flat-square)](https://nodejs.org/en/)

Another simple Node.js template engine.

> **Warning**  
> This library uses `new Function` (which uses `eval`) to compile template code. You should sanitize the data when dealing with user input.

## Installation

```
npm i ying
```

# Usage

## Compiling a template

```js
import ying from 'ying';

const templateFunc = ying('<template>');
```

Use `ying(templateStr)` to compile a template string into a JavaScript function.

## Get a property value with `{{prop}}`

> `{{prop}}` automatically encode the property value into valid HTML.

```js
import ying from 'ying';

const func = ying('<p>{{name}}</p>');
console.log(func({ name: 'hi >>>' }));
```

Output:

```html
<p>hi &gt;&gt;&gt;</p>
```

Nested properties are also supported.

```js
import ying from 'ying';

const func = ying('<p>{{client.os.name}}</p>');
console.log(
  func({
    client: {
      os: {
        name: 'linux',
      },
    },
  }),
);
```

Output:

```
<p>linux</p>
```

## Embed a JavaScript Expression with `{{= expr}}`

```js
import ying from 'ying';

const func = ying('{{= "Current date: " + new Date() }}');
console.log(func());
```

Output:

```
Current date: Sun Feb 07 2016 10:12:49 GMT+0800 (CST)
```

Use a predefined variable named `d` to get the data passed to template.

```js
import ying from 'ying';

var func = ying('{{= d.name || "<None>"}}');
console.log(func({ name: 'hi >>>' }));
console.log(func());
```

Output:

```
hi >>>
<None>
```

To escape text for HTML inside expressions, use another predefined function `_e(str)`:

```js
import ying from 'ying';

var func = ying('{{= _e(d.name || "<None>")}}');
console.log(func({ name: 'hi >>>' }));
console.log(func());
```

Output:

```
hi &gt;&gt;&gt;
&lt;None&gt;
```

## Embed a JavaScript Function with `{{# body}}`

Example, populate an HTML list using `for` loops:

```js
import ying from 'ying';

// Here we use ES6 template literals which supports multi-line strings.
const func = ying(`<ul>{{#
  if (!d.users) {
    return "<li>No users available</li>"
  }
  let result = "";
  for(var user of d.users) {
    result += "<li>" + _e(user) + "</li>";
  }
  return result;
}}</ul>`);
console.log(func({ users: ['hi', '<ABC>', '123'] }));
```

Output:

```
<ul><li>hi</li><li>&lt;ABC&gt;</li><li>123</li></ul>
```

## Direct code injection with `{{~ code}}`

Example, `if-else` code blocks:

```js
import ying from 'ying';

const func = ying(`
  {{~ if(d.os == 'ios') { }}
    <p>You are using iOS</p>
  {{~ } else if(d.os == 'android') { }}
    <p>You are using Android</p>
  {{~ } else { }}
    <p>Unknown OS</p>
  {{~ } }}
`);
console.log(func({ os: 'ios' }));
console.log(func({ os: 'android' }));
console.log(func({ os: 'wp' }));
```

Output:

```
<p>You are using iOS</p>
<p>You are using Android</p>
<p>Unknown OS</p>
```

# More Examples

## Composite templates

ying can also accomplish something like [Jade's Includes](http://jade-lang.com/reference/includes/).

```js
import ying from 'ying';

// Create 2 template functions
// page_content in parentTemplate will be set by result of childTemplate
var parentTemplate = ying(
  '<html><head><title>{{page_title}}</title><body>{{=d.page_content}}</body></html>',
);
var childTemplate = ying('<h1>{{name}}</h1><p>{{description}}</p>');

// 2 data object, each for their own template function
function compositeTemplate(parentData, childData) {
  // setting result of childTemplate to parentData.page_content
  parentData.page_content = childTemplate(childData);
  return parentTemplate(parentData);
}

var result = compositeTemplate(
  { page_title: 'Title of this page' },
  { name: 'hi', description: 'hello' },
);
console.log(result);
```

Output:

```html
<html><head><title>Title of this page</title><body><h1>hi</h1><p>hello</p></body></html>
```
