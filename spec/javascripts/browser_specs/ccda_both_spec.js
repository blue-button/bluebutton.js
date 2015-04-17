var template = readFixtures('../../../lib/generators/ccda_template.ejs');

describe('Emerge JSON -> CCDA -> JSON', function() {
  var jsonInputStr = readFixtures('../fixtures/json/emerge_ccda_expected_output.json');

  runPassThroughTest(BlueButton, jsonInputStr, 'emerge', template);
});

describe('NIST JSON -> CCDA -> JSON', function() {
  var jsonInputStr = readFixtures('../fixtures/json/nist_ccda_expected_output.json');

  runPassThroughTest(BlueButton, jsonInputStr, 'nist', template);
});
