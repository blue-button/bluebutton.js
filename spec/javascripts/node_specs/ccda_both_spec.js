var fs = require('fs'),
    path = require('path'),
    runJsonTests = require('../helpers/shared_spec').runJsonTests,
    BlueButton = require('../../../build/bluebutton');

var runPassThroughTest = function(jsonInputStr) {
  // Takes some initial JSON (jsonInputStr)

  // Generates a CCDA from it
  var template = fs.readFileSync(path.resolve(__dirname,
      '../../../lib/generators/ccda_template.ejs'), 'utf-8');
  var bb = BlueButton(jsonInputStr, {
    template: template,
    generatorType: 'ccda',
    testingMode: true
  });
  var bbGeneratedXml = bb.data;

  // Then parses the CCDA with BB again
  bb = BlueButton(bbGeneratedXml);

  // And makes sure we get back what we sent in
  // (minus a whitelist of expected differences, in each of the tests below)
  runJsonTests(JSON.parse(jsonInputStr), 'ccda', bb);
};

describe('Emerge JSON -> CCDA -> JSON', function() {
  // start with what would usually be our "expectedJson"
  var jsonInputStr = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/emerge_ccda_expected_output.json'), 'utf-8');

  // the codeSystemName in EMERGE files differs from our convention
  jsonInputStr = jsonInputStr.replace(/SNOMED\-CT/g, 'SNOMED CT');

  runPassThroughTest(jsonInputStr);

});

describe('NIST JSON -> CCDA -> JSON', function() {
  // start with what would usually be our "expectedJson"
  var jsonInputStr = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/nist_ccda_expected_output.json'), 'utf-8');

  // The display name and code disagree in the source file.
  // We're going to end up relying on the display name, so fix the code to fit.
  jsonInputStr = jsonInputStr.replace('GPARNT', 'GRFTH');
  // Some modifications will be easier with the actual JSON
  var parsedJson = JSON.parse(jsonInputStr);
  // We don't generate encounter locations, because that would require adding a location
  // type code that we don't want to have to pay attention to (and the location is optional
  // but the code is not optional once you have a location)
  parsedJson.encounters.forEach(function(encounter) {
    encounter.location = {
      street: [],
      city : null,
      state : null,
      zip : null,
      country : null,
      organization : null
    };
  });
  // We could probably make this one work without new data if someone runs into issues...
  parsedJson.procedures.forEach(function(procedure) {
    procedure.performer = {
      street: [],
      city : null,
      state : null,
      zip : null,
      country : null,
      organization : null,
      phone: null
    };
  });
  // If we include a med performer, there is some other data that becomes necessary
  parsedJson.medications.forEach(function(medication) {
    medication.prescriber = {
        organization: null,
        person: null
      };
  });
  jsonInputStr = JSON.stringify(parsedJson);

  runPassThroughTest(jsonInputStr);

});
