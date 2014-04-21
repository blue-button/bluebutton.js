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
  /* HL7 xml has lab effectiveTimes which are near Daylight Saving time.
   * Chrome/FF/Node (incorrectly) say a Date of 03/23/2000 is NOT in Daylight Saving time. Safari/PhantomJS say it is.
   * Here we modify the expected output for PhantomJS to fix that date for Node. */
  expectedOutput['labs'].forEach(function(lab) {
    lab['results'].forEach(function(result) {
      result['date'] = '2000-03-23T08:00:00.000Z';
    });
  });

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, bb);

});