
# BlueButton.js

A JavaScript library to work with Blue Button data in the form of XML Continuity of Care Documents, supporting both C32 and CCDA standards.

**This project is under heavy development!** Until a v1.0.0 release, the public API will change, a lot.

## Community and Contributing

This project is currently under development by members of the [Blue Button developer community](https://github.com/blue-button?tab=members) and will be maintained by [OSEHRA](http://osehra.org).

Until a public release (version 0.1.0), this project is considered a "developer preview" and pull requests will be ignored. If you have a suggestion or concern, submit an issue or tweet us at [@bluebuttondev](http://twitter.com/bluebuttondev).

## Building

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
  date: {
    value: 20110301
  },
  directions: {
    text: "2 puffs QID PRN wheezing"
  },
  instructions: {
    text: "Generic Substitution Allowed"
  },
  drugVehicle: {
    name: "Diethylene Glycol",
    codeSystemName: "SNOWMED CT",
    codeSystem: "2.16.840.1.113883.6.96",
    code: 5955009
  },
  status: {
    name: "Active",
    codeSystemName: "SNOMED CT",
    codeSystem: "2.16.840.1.113883.6.96",
    code: 55561003
  },
  indication: {
    name: " Bronchitis",
    codeSystemName: "SNOWMED CT",
    codeSystem: "2.16.840.1.113883.6.96",
    code: 32398004
  }
}
```

## Immunizations

Use the `immunizations` method to retrieve a list of all immunizations:

```javascript
bb.immunizations();  // Returns all immunizations as an Array
```

And an example immunization object:

```javascript
{
  product: {
    name: "Tetanus and diphtheria toxoids - preservative free",
    codeSystemName: "CVX",
    codeSystem: "2.16.840.1.113883.6.59",
    code: 573621
  },
  instructions: {
    text: "Possible flu-like symptoms for three days."
  },
  date: {
    value: 19981215
  },
  status: {
    name: "Completed"
  }
}
```



<!--
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
