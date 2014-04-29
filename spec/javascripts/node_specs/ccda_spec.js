var fs = require('fs'),
    path = require('path'),
    runJsonTests = require('../helpers/shared_spec'),
    BlueButton = require('../../../build/bluebutton');

describe('CCDA', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../../../bower_components/sample_ccdas/HL7\ Samples/CCD.sample.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/ccda_expected_browser_output.json'), 'utf-8'));

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, 'ccda', bb);

});