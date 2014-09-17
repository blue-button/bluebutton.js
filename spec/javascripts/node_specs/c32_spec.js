var fs = require('fs'),
    path = require('path'),
    runJsonTests = require('../helpers/shared_spec'),
    BlueButton = require('../../../build/bluebutton');

describe('C32', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/c32/HITSP_C32v2.5_Rev6_16Sections_Entries_MinimalErrors.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/c32_expected_browser_output.json'), 'utf-8'));

  /* There are several dates near Daylight Saving time.
   * Chrome/FF/Node (incorrectly) say a Date of 03/23/2000 or 03/28/2000 is NOT in Daylight Saving time. Safari/PhantomJS say it is.
   *
   * There are also some currently invalid dates that get parsed as "Invalid Date" by phantom and null by node
   *
   * Here we modify the expected output for PhantomJS to fix the data for Node. */
  expectedOutput['results'].forEach(function(lab) {
    if (lab['date'] === '2000-03-23T07:00:00.000Z') {
      lab['date'] = '2000-03-23T08:00:00.000Z';
    }
    lab['tests'].forEach(function(result) {
      if (result['date'] === '2000-03-23T07:00:00.000Z') {
        result['date'] = '2000-03-23T08:00:00.000Z';
      }
    });
  });

  expectedOutput['medications'].forEach(function(med) {
    if (med['date_range']['start'] === '2000-03-28T07:00:00.000Z') {
      med['date_range']['start'] = '2000-03-28T08:00:00.000Z';
    }
    if (med['date_range']['start'] === 'Invalid Date') {
      med['date_range']['start'] = null;
    }
  });

  expectedOutput['problems'].forEach(function(problem) {
    if (problem['date_range']['start'] === 'Invalid Date') {
      problem['date_range']['start'] = null;
    }
  });

  expectedOutput['procedures'].forEach(function(procedure) {
    if (procedure['date'] === 'Invalid Date') {
      procedure['date'] = null;
    }
  });



  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, 'c32', bb);

});