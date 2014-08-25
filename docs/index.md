---
layout: docs
---

# Documentation

## Parsing Documents <a name="parsing"></a>
### An Overview <a name="parsing-overview"></a>

BlueButton.js supports a few different health data types, like C32 and CCDA. To parse a health document, pass the source data to `BlueButton`:

```JavaScript
var myRecord = BlueButton(xml);
```

BlueButton.js will detect the document type and choose the appropriate parser. The returned object has the following properties:

```JavaScript
myRecord.type    // The document type ('ccda', 'c32', etc.)
myRecord.source  // The parsed source data (XML) with added querying methods
myRecord.data    // The final parsed document data
```

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
ccda.data.care_plan
ccda.data.chief_complaint
ccda.data.demographics
ccda.data.encounters
ccda.data.functional_statuses
ccda.data.immunizations
ccda.data.instructions
ccda.data.labs
ccda.data.medications
ccda.data.problems
ccda.data.procedures
ccda.data.smoking_status
ccda.data.vitals
```

The `data` object and each section also has a `json` method to easily view the data:

```JavaScript
// View all the data as JSON
ccda.data.json();

// View just the medication data as JSON
ccda.data.medications.json();
```

### An Example Using Node <a name="parsing-node"></a>

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

### An Example in the Browser <a name="parsing-browser"></a>

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

### An Example Using Python + Node <a name="parsing-python"></a>

First, install `npm` and `node` on the server running Python.

Python code to call out to Node:

```Python
import subprocess

# if node isn't on your path, the first arg should instead be a path to the node bin
cmd_list = ['node', 'parseClinicalXml.js', path_to_file]

p = subprocess.Popen(cmd_list, stdout=subprocess.PIPE,
    stdin=subprocess.PIPE, stderr=subprocess.PIPE)
result, error = p.communicate()
p.stdin.close()

if p.returncode != 0:
    print error
    raise ValueError("Failed to parse clinical XML at %s" % \
        path_to_file)

return result
```

`parseClinicalXml.js`, the Node file referenced above:

```JavaScript
var fs = require('fs');
var cli = require('cli');
var BlueButton = require('bluebutton');

var filePath = cli.args[0];

var xml = fs.readFileSync(filePath, 'utf-8');
var myRecord = BlueButton(xml);
var result = myRecord.data.json();
console.log(result); // goes to stdout, which is piped into our variable `result` above
```

[Ruby](http://stackoverflow.com/a/3159997) and many other languages have similar tools for calling out to the command-line.

## Generating Documents <a name="generating"></a>

### An Overview <a name="generating-overview"></a>

Finding a good parser for CCDAs before BlueButton.js was a pain, but there were a few options out there. Generation was much more difficult. You could use [Model Driven Health Tools](https://www.projects.openhealthtools.org/sf/projects/mdht/), which is very robust but requires the user to have intimate knowledge of the architecture of CCDAs and has all the downsides of an enterprise-style Java project. Or you could roll your own tool.

BlueButton.js lets you pass in the same JSON you would get when parsing a document (JSON construction has robust support from pretty much every language) and returns a beatifully constructed CCDA to you. It supports a smaller portion of the CCDA spec than MDHT, but CCDAs constructed with BlueButton.js have successfully passed Meaningful Use Stage 2 certification.

BlueButton.js only supports generating CCDAs right now.

### Node Usage <a name="generating-node"></a>
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

### Browser Usage <a name="generating-browser"></a>

In order to do generation in the browser, include a copy of ejs.js before bluebutton.js (using the visionmedia implementation popular in Node and not the implementation at http://embeddedjs.com/) and then load the ejs template via XHR like so:

```HTML
<body>
  <script src="./spec/javascripts/helpers/ejs.js"></script>
  <script src="./bluebutton/build/bluebutton.js"></script>
  <script>
    var json = ...; // client-generated or fetched via XHR, depending on your application

    var xhr = new XMLHttpRequest(); // this could also be AJAX based
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

### Python + Node Usage <a name="generating-python"></a>

Python to call out to Node:

```Python
import subprocess

cmd_list = ['node', 'generateCcda.js']

p = subprocess.Popen(cmd_list, stdout=subprocess.PIPE,
        stdin=subprocess.PIPE, stderr=subprocess.PIPE)
p.stdin.write(json_to_convert)
result, error = p.communicate()
p.stdin.close()

if p.returncode != 0:
    print error
    raise ValueError("Failed to generate CCDA from JSON:\n\n%s" % json_to_convert)

return result
```

`generateCcda.js`:

```JavaScript
var fs = require('fs'); // built-in
var cli = require('cli');
var BlueButton = require('bluebutton');

var ccdaTemplate = fs.readFileSync('./ccda_template.ejs', 'utf-8');

cli.withStdin(function(json) {
    var bb = BlueButton(json, {
        generatorType: 'ccda',
        template: ccdaTemplate
    });

    console.log(bb.data);
});
```

## Logistics <a name="logistics"></a>
### Creating a Build <a name="logistics-build"></a>

Run `grunt` to build the library. A `build/` directory will be created containing the standard and minified builds.

### Running the Test Suite <a name="logistics-test"></a>

Use `grunt test` to run the test suite. This is important to do after making any changes to the parsers. Before running the tests the first time, run `bower install` to download the sample CCDA the tests require. (Run `npm install -g bower` if you don't yet have [Bower](http://bower.io)). Tests can be found in the [`spec/`](https://github.com/blue-button/bluebutton.js/tree/master/spec/javascripts) directory.

### Bugs and Contributing <a name="logistics-github"></a>

The project is hosted at https://github.com/blue-button/bluebutton.js. Please create Github Issues and pull requests for bugs you run into / changes you would like to make!