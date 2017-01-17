# BlueButton.js [![Build Status](https://travis-ci.org/blue-button/bluebutton.js.svg?branch=master)](https://travis-ci.org/blue-button/bluebutton.js)

BlueButton.js helps developers parse and generate complex health data formats like C-CDA with ease, so you can empower patients with access to their health records. [Try the demo.](http://blue-button.github.io/bluebutton.js/sandbox/)

## Status: not under active development

The library is no longer under active development (extending generation / parsing capabilities, etc.). The existing feature set is fairly stable, but if you want to parse or generate additional data elements, you will likely have to fork + extend the library. If you make a pull request, I can review it and try to integrate it into the main library, and if you find a bug and provide details, including a sample file to reproduce, I may be able to help fix it.

See also https://github.com/amida-tech/blue-button and https://github.com/amida-tech/blue-button-generate – forks which have diverged significantly but are under more active development.

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

## Detailed Documentation

[View the documentation](http://blue-button.github.io/bluebutton.js/docs) for an explanation of the data sections, much more detailed sample code, instructions on how to generate a build, etc.
