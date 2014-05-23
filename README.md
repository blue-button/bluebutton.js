# BlueButton.js

BlueButton.js helps developers navigate complex health data with ease, all in the spirit of empowering patients with access to their health records. [Try the demo.](http://www.bluebuttonjs.com/sandbox)

## Getting Started

BlueButton.js supports a few different health data types, like C32 and CCDA. To parse a health document, pass the source data to `BlueButton`:

```JavaScript
var myRecord = BlueButton(xml);
```

BlueButton.js will detect the document type and choose the appropriate parser. The returned object has the following properties:

```JavaScript
myRecord.type    // The document type
myRecord.source  // The parsed source data with added querying methods
myRecord.data    // The final parsed document data
```

## CCDA Example

Here's an example using BlueButton.js to parse a CCDA health summary. First, pass the CCDA XML to `BlueButton`:

```JavaScript
var ccda = BlueButton(xml);
```

Access the parsed data like so:

```JavaScript
ccda.type  // Returns the string "ccda"
ccda.data  // Returns an object containing the parsed CCDA sections

// Available document sections
ccda.data.document
ccda.data.allergies
ccda.data.demographics
ccda.data.encounters
ccda.data.immunizations
ccda.data.labs
ccda.data.medications
ccda.data.problems
ccda.data.procedures
ccda.data.vitals
```

The `data` object and each section also has a `json` method to easily view the data:

```JavaScript
// View all the data as JSON
ccda.data.json();

// View just the medication data as JSON
ccda.data.medications.json();
```

## CommonJS and AMD support

BlueButton.js uses a UMD wrapper to support NodeJS and AMD module loaders, like RequireJS.

### An Example Using Node

```bash
$ npm install bluebutton
```

```JavaScript
var fs = require('fs');
var BlueButton = require('bluebutton');

var xml = fs.readFileSync('./example/xml/ccd.xml', 'utf-8');
var myRecord = BlueButton(xml);

// Log the demographics data
console.log(myRecord.data.demographics.json());
```

### An Example Using RequireJS

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
  
  var myRecord = BlueButton(xml);
  
  // Log the demographics data
  console.log(myRecord.data.demographics.json());
});
```

### An Example in the Browser

```HTML
<body>
  <script src="./bower_components/bluebutton/build/bluebutton.js"></script>
  <script>
    var xhr = new XMLHttpRequest();
    xhr.open('get', './examples/xml/ccd.xml', false);
    xhr.send();
    
    var myRecord = BlueButton(xhr.responseText);
    
    // Log the demographics data
    console.log(myRecord.data.demographics.json());
  </script>
</body>
```

## Generation

```JavaScript
var json = fs.readFileSync('./example.json', 'utf-8');
var template = fs.readFileSync('./build/ccda_template.ejs');
var myRecord = BlueButton(json, {
  generatorType: 'ccda',
  template: template
});

// Log the resulting XML
console.log(myRecord.data);
```

XML Generation requires ejs (https://github.com/visionmedia/ejs).

### Browser Usage

In order to do generation in the browser, include a copy of ejs.js before bluebutton.js (using the visionmedia implementation popular in Node and not the implementation at http://embeddedjs.com/) and then load the ejs template via XHR like so:

```HTML
<body>
  <script src="./spec/javascripts/helpers/ejs.js"></script>
  <script src="./bluebutton/build/bluebutton.js"></script>
  <script>
    var json = ...; // client-generated or fetched via XHR, depending on your application

    var xhr = new XMLHttpRequest();
    xhr.open('get', './bluebutton/build/ccda_template.ejs', false);
    xhr.send();
    var template = xhr.responseText;

    var myRecord = BlueButton(json, {
      generatorType: 'ccda',
      template: template
    });

    // Log the resulting XML
    console.log(myRecord.data);
  </script>
</body>
```

## Creating a Build

Run `grunt` to build the library. A `build/` directory will be created containing the standard and minified builds.

## Running the Test Suite

Use `grunt test` to run the test suite. This is important to do after making any changes to the parsers. Before running the tests the first time, run `bower install` to download the sample CCDA the tests require. (Run `npm install -g bower` if you don't yet have [Bower](http://bower.io)). Tests can be found in the [`spec/`](/spec) directory.
