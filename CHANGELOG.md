# ying ChangeLog
## 0.2.1 2016-1-14
* Add `engines` field to package.json.

## 0.2.0 2016-1-3
* Add direct code injection operator "~".

## 0.1.2 2016-1-1
* Improve performance by removing `fs.readFileSync` calls.
* Use `escape-html` to escape characters for HTML.

## 0.1.1 2015-11-30
* Fix a critical character escaping issue.

## 0.1.0 2015-11-29
* **(Breaking)** Remove opt.multiline, multiline expression is enabled by default.
* Fix compilation error when using ES6 expression.

## 0.0.8 2015-11-6
* Fix wrong result in multiline mode.
* Make all tests running in both singleline and multiline mode.
* Add `opt.logging` in README.md.

## 0.0.7 2015-11-5
* Add `opt.multiline` option.

## 0.0.6 2015-10-10
* Fix string literal trimmed in compiled function.

## 0.0.5 2015-9-29
* Better docs, more tests.
