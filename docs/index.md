---
layout: docs
---

# Welcome to BlueButton.js

Healthcare data and documents can be difficult to parse and navigate. BlueButton.js is designed to make life a little easier for healthcare developers by providing a single API to the health record, so you can focus on the data and the patient. BlueButton.js currently supports CCDA and C32 documents, but there's room to expand if the community has an interest.

## Getting Started

To use BlueButton.js with a health document, start by creating a Blue Button document object by passing the CCD XML to `BlueButton`:

```javascript
var bb = BlueButton(xml);
```

The document object, `bb` in this example, now exposes all CCD data through a simple and consistent interface. Each section of the document can be accessed using its associated method.

## Document Sections

The health record sections are available using the following public methods. JavaScript objects representing the patient data for that section is returned from each method:

```javascript
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
Information about the document itself can be accessed by using the `document` method:

```javascript
// Returns an object containing information about the CCD document
bb.document();
```

<!--

## Filters

Filters are objects that can be used to access a subset of the document section. Each section method accepts different filters.

Example: These options will return medications from 2012 to 2013 that are active:

```javascript
bb.medications({
  from: 2012,
  to: 2013,
  status: "active"
});
```

## Dates

All dates and times are represented in [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) in either `YYYY-MM-DD` or including the time as `YYYY-MM-DDTHH:MMZ`. For example, a date might look like `2013-02-07` or `2013-02-07T03:29Z`.

## Other Methods

TODO: Consider other methods supported by the Blue Button document object.

```javascript
bb.toJSON();  // Get the entire record as JSON

bb.xml();     // Get the source XML element
bb.xmlDOM();
bb.dom();

bb.all();     // Get the entire health record
bb.everything();
```

-->
