define(['../../../build/bluebutton'], function(BlueButton) {
  describe('HL7 CCDA', function() {
    var record = readFixtures('../../../bower_components/sample_ccdas/HL7%20Samples/CCD.sample.xml');
    var expectedOutput = getJSONFixture('hl7_ccda_expected_output.json');
    var bb = BlueButton(record);

    // the tests are defined in helpers/shared_spec.js
    runJsonTests(expectedOutput, 'ccda', bb);

  });

  describe('EMERGE CCDA', function() {
    var record = readFixtures('../../../bower_components/sample_ccdas/EMERGE/Patient-0.xml');
    var expectedOutput = getJSONFixture('emerge_ccda_expected_output.json');
    var bb = BlueButton(record);

    // the tests are defined in helpers/shared_spec.js
    runJsonTests(expectedOutput, 'ccda', bb);

  });

  describe('Allscripts CCDA', function() {
    var record = readFixtures('../../../bower_components/sample_ccdas/Allscripts\ Samples/Enterprise\ EHR/b2\ Adam\ Everyman\ ToC.xml');
    var expectedOutput = getJSONFixture('allscripts_ccda_expected_output.json');
    var bb = BlueButton(record);

    // the tests are defined in helpers/shared_spec.js
    runJsonTests(expectedOutput, 'ccda', bb);

  });

  describe('NIST CCDA', function() {
    var record = readFixtures('../../../bower_components/sample_ccdas/NIST%20Samples/CCDA_CCD_b1_InPatient_v2.xml');
    var expectedOutput = getJSONFixture('nist_ccda_expected_output.json');
    var bb = BlueButton(record);

    // the tests are defined in helpers/shared_spec.js
    runJsonTests(expectedOutput, 'ccda', bb);

  });
});