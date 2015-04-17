var fs = require('fs'),
    path = require('path'),
    runJsonTests = require('../helpers/shared_spec').runJsonTests,
    BlueButton = require('../../../build/bluebutton');

describe('HL7 CCDA', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../../../bower_components/sample_ccdas/HL7\ Samples/CCD.sample.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/hl7_ccda_expected_output.json'), 'utf-8'));

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, 'ccda', bb);

});

describe('EMERGE CCDA', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../../../bower_components/sample_ccdas/EMERGE/Patient-0.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/emerge_ccda_expected_output.json'), 'utf-8'));

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, 'ccda', bb);

});

describe('Allscripts CCDA', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../../../bower_components/sample_ccdas/Allscripts\ Samples/Enterprise\ EHR/b2\ Adam\ Everyman\ ToC.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/allscripts_ccda_expected_output.json'), 'utf-8'));

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, 'ccda', bb);

});

describe('NIST CCDA', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../../../bower_components/sample_ccdas/NIST\ Samples/CCDA_CCD_b1_InPatient_v2.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/nist_ccda_expected_output.json'), 'utf-8'));

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, 'ccda', bb);

});