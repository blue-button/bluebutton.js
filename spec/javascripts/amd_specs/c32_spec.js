define(['../../../build/bluebutton'], function(BlueButton) {
  describe('C32', function() {
    var record = readFixtures('../fixtures/c32/HITSP_C32v2.5_Rev6_16Sections_Entries_MinimalErrors.xml');
    var expectedOutput = getJSONFixture('c32_expected_browser_output.json');
    var bb = BlueButton(record);

    // the tests are defined in helpers/shared_spec.js
    runJsonTests(expectedOutput, 'c32', bb);

  });
});