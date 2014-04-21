describe('CCDA', function() {
  var record = readFixtures('../../../bower_components/sample_ccdas/HL7%20Samples/CCD.sample.xml');
  var expectedOutput = getJSONFixture('ccda_expected_browser_output.json');
  var bb = BlueButton(record);

  // the tests are defined in helpers/shared_spec.js
  runJsonTests(expectedOutput, bb);

});