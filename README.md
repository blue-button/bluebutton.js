
# BlueButton.js

A JavaScript library to work with Blue Button data. BlueButton.js supports CCDA and VA C32 documents.

**This project is under heavy development!** Until a v1.0.0 release, the public API will change, a lot.

## Community and Contributing

This project is currently under development by members of the [Blue Button developer community](https://github.com/blue-button?tab=members) and will be maintained by [OSEHRA](http://osehra.org).

Until a public release (v0.1.0), this project is considered a "developer preview". If you have a suggestion or concern, submit an issue or tweet us at [@bluebuttondev](http://twitter.com/bluebuttondev).

## Building

Run `rake build` to build both the development and production JavaScript.

Requirements:

- [Ruby](http://www.ruby-lang.org/). We recommend using Ruby 2.0. View [installation instructions](http://www.ruby-lang.org/en/downloads/).
- [Google's Closure Compiler](https://developers.google.com/closure/compiler/). Download the [latest version](http://closure-compiler.googlecode.com/files/compiler-latest.zip), unzip, and place `compiler.jar` into the `vendor` directory.

All builds are placed in the `build/` directory. Both development and production builds first assemble all JavaScript files in the `src/` directory in the order defined in `manifest.json`. All JavaScript files are concatenated and compiled with Google's Closure Compiler. All errors and warnings will be printed to the console and the script will quit.

<!--
## Running Tests

Run `rake tests`.

Tests are run using [PhantomJS](http://phantomjs.org), [QUnit](http://qunitjs.com), and [JSHint](http://www.jshint.com).
-->

# Usage

Start by creating a Blue Button document object by passing the CCD XML (C32 or CCDA) to `BlueButton`:

```javascript
var bb = BlueButton(xml);
```

The Blue Button document object, `bb` in this example, now exposes all patient data through a simple and consistent interface.
