
# BlueButton.js

A JavaScript library to work with Blue Button Continuity of Care Document (CCD) data.

This project is under heavy development and the API is subject to change, a lot!

## Building

All JavaScript files are concatenated and compiled with [Google's Closure Compiler](https://developers.google.com/closure/compiler/). If errors or warnings are found during compilation, the compiler will print them and quit.

Run `rake build` to build in production mode. The compiler uses `SIMPLE_OPTIMIZATIONS` and a closure will wrap the resulting JavaScript. (Read more about [compilation levels](https://developers.google.com/closure/compiler/docs/compilation_levels).)

Run `rake build[dev]` to build the developer. The compiler uses the `WHITESPACE_ONLY` and `PRETTY_PRINT` options to condense but preserve resulting JavaScript.

## Running Tests

Run `rake tests`.

Tests are run using [PhantomJS](http://phantomjs.org), [QUnit](http://qunitjs.com), and [JSHint](http://www.jshint.com).

# The API

Parse a Blue Button CCD XML document using:

```javascript
var bb = BlueButton(xml);
```

## Medications

## Labs

```javascript
bb.labs();

bb.labs({
  from: '1-9-10',
  to: '7-14-12'
});

bb.labs({
  type: 'a1c'
});

bb.labs({
  type: [
    'a1c', 'hdl', 'ldl', 'tg'
  ]
});

bb.labRanges('chol');

// returns
// {
//   chol: {
//     min: 34,
//     max: 129
//   }
// }

bb.labRanges([
  'chol', 'hdl', 'ldl'
]);

// returns
// {
//   chol: {
//     min: 23,
//     max: 242
//   },
//   hdl: {
//     min: 22,
//     max: 45
//   },
//   ldl: {
//     min: 34,
//     max: 42
//   }
// }
```

<!--
## UI Examples

```javascript
bb.UI.labBar({
  name: 'hdl',
  date: '2-13-12',
  bind_to: 'hdl-bar'
});

bb.UI.medList({
  from: '8-16-10',
  to: '10-18-12',
  bind_to: 'my-meds'
});
```
-->
