# BlueButton.js

BlueButton.js is JavaScript library to help make working with healthcare data easier. [Try the demo.](http://blue-button.github.io/applications/tools/js/sandbox.html)

**This project is under heavy development!** Until a v1 release, the public API will change, a lot.

## Getting Started

To use BlueButton.js with a health document, start by creating a Blue Button document object by passing the CCD XML to BlueButton:

```JavaScript
var bb = BlueButton(xml);
```

The document object, `bb` in this example, now exposes all CCD data through a simple and consistent interface. Each section of the document can be accessed using its associated method.

## Document Sections

The health record sections are available using the following public methods. JavaScript objects representing the patient data for that section is returned from each method:

```JavaScript
// Returns personal information and demographics
bb.demographics();

// Returns allergies and alerts
bb.allergies();

// Returns encounters
bb.encounters();

// Returns a list of immunizations
bb.immunizations();

// Returns a list of laboratory results, organized by panel
bb.labs();

// Returns a list of medications
bb.medications();

// Returns the problem list
bb.problems();

// Returns a list of procedures
bb.procedures();

// Returns a list of vital readings, grouped by date
bb.vitals();
```

Information about the document itself can be accessed by using the document method:

```JavaScript
// Returns an object containing information about the CCD document
bb.document();
```

## JSON

Each section contains a convenience `json()` method.

```JavaScript
// Returns a JSON representation of demographics
bb.demographics().json();

// Returns a JSON representation of the entire document
bb.document().json();
```

## CommonJS and AMD support

BlueButton.js uses a UMD wrapper to support NodeJS and AMD module loaders like RequireJS.

### Example using Node

```JavaScript
var fs = require('fs');
var BlueButton = require('bluebutton');

var xml = fs.readFileSync('./example/xml/ccd.xml', 'utf-8');
var bb = BlueButton(xml);

// Log demographics JSON object
console.log(bb.demographics().json());
```

### Example using RequireJS

```JavaScript
require.config({
  paths: {
    bluebutton: '../bower_components/bluebutton.js/build/bluebutton',
    text: '../bower_components/text/text',
    examples: '../examples'
  }
});

require(['bluebutton', 'text!examples/xml/ccd.xml'], function (BlueButton, xml) {
  'use strict';

  var bb = BlueButton(xml);
  
  // Log demographics JSON object
  console.log(bb.demographics().json());
});
```

### Example using Browser Global

```HTML
<body>
  <script src="./bower_components/bluebutton/build/bluebutton.js"></script>
  <script>
    var xhr = new XMLHttpRequest();
    xhr.open('get', './examples/xml/ccd.xml', false);
    xhr.send();

    var bb = BlueButton(xhr.responseText);

    // Log demographics JSON object
    console.log(bb.demographics().json());
  </script>
</body>
```

## Creating a Build

Run `grunt` to build the library. All builds are placed in the [`build/`](/build) directory.

Be sure to version up `package.json`, `bower.json`, and add any changes to `History.md` before releasing.
