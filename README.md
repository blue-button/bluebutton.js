
# BlueButton.js

A JavaScript library to work with Blue Button data in the form of XML Continuity of Care Documents, supporting both C32 and CCDA standards.

**This project is under heavy development!** Until a v1.0.0 release, the public API will change, a lot.

## Community and Contributing

This project is currently under development by members of the [Blue Button developer community](https://github.com/blue-button?tab=members) and will be maintained by [OSEHRA](http://osehra.org).

Until a public release (version 0.1.0), this project is considered a "developer preview". If you have a suggestion or concern, submit an issue or tweet us at [@bluebuttondev](http://twitter.com/bluebuttondev).

## Building

<!-- TODO: Say something about requiring Ruby. -->

Download the latest [Google's Closure Compiler](http://closure-compiler.googlecode.com/files/compiler-latest.zip) and unzip it to the `vendor` directory.

Run `rake build` to build both the development and production JavaScript.

Builds are placed in the `build/` directory. Both builds first assemble all JavaScript files in the `src/` directory in the order defined in `manifest.json`. All JavaScript files are concatenated and compiled with [Google's Closure Compiler](http://developers.google.com/closure/compiler/). If errors or warnings are found during compilation, the compiler will quit and they will be printed in the console.

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

The document object, `bb` in this example, now exposes all CCD data through a simple and consistent interface. Accessing major sections of the CCD document are shown below.

## Medications

Use the `meds` method to retrieve a list of all medications:

```javascript
bb.meds();  // Returns all medications as an Array
```

And an example medication object:

```javascript
{
  product: {
    name: "Proventil 0.09 MG/ACTUAT inhalant solution",
    codeSystemName: "RxNorm",
    codeSystem: "2.16.840.1.113883.6.88",
    code: 573621
  },
  date: 20110301,
  directions: "2 puffs QID PRN wheezing",
  instructions: "Generic Substitution Allowed",
  status: "active",
  drugVehicle: {
    name: "Diethylene Glycol",
    codeSystemName: "SNOWMED CT",
    codeSystem: "2.16.840.1.113883.6.96",
    code: 5955009
  },
  indication: {
    name: "Bronchitis",
    codeSystemName: "SNOWMED CT",
    codeSystem: "2.16.840.1.113883.6.96",
    code: 32398004
  }
}
```
