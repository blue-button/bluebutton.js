# BlueButton.js [![Build Status](https://travis-ci.org/blue-button/bluebutton.js.svg?branch=master)](https://travis-ci.org/blue-button/bluebutton.js)

BlueButton.js helps developers parse and generate complex health data formats like C-CDA with ease, so you can empower patients with access to their health records. [Try the demo.](http://www.bluebuttonjs.com/sandbox/)

## Quick Start

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

Note: Many of the example health records posted here are missing the XML declaration required by the BlueButton.js parser. If you are experiencing errors with CCDA parsing, add ```XML <?xml version="1.0" encoding="UTF-8" standalone="no" ?>``` as the first line of your CCDA file. 

## Detailed Documentation

See http://www.bluebuttonjs.com/docs/ for an explanation of the data sections, much more detailed sample code, instructions on how to generate a build, etc.
