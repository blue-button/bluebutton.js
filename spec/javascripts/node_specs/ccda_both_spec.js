var fs = require('fs'),
    path = require('path'),
    runPassThroughTest = require('../helpers/shared_spec').runPassThroughTest,
    BlueButton = require('../../../build/bluebutton');

var template = fs.readFileSync(path.resolve(__dirname,
      '../../../lib/generators/ccda_template.ejs'), 'utf-8');

describe('Emerge JSON -> CCDA -> JSON', function() {
  // start with what would usually be our "expectedJson"
  var jsonInputStr = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/emerge_ccda_expected_output.json'), 'utf-8');

  runPassThroughTest(BlueButton, jsonInputStr, 'emerge', template);

});

describe('NIST JSON -> CCDA -> JSON', function() {
  // start with what would usually be our "expectedJson"
  var jsonInputStr = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/nist_ccda_expected_output.json'), 'utf-8');

  runPassThroughTest(BlueButton, jsonInputStr, 'nist', template);

});
