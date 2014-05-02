describe('CCDA Generation', function() {
  var record = readFixtures('../fixtures/json/ccda_expected_browser_output.json');
  var template = readFixtures('../../../lib/generators/ccda_template.ejs');
  var expectedOutput = readFixtures('../fixtures/ccda/ccda_expected_output.xml');
  
  var bb = BlueButton(record, {
    template: template,
    generatorType: 'ccda',
    testingMode: true
  });

  it('should output the correct xml', function() {
    var actual = bb.data;
    var expected = expectedOutput;

    expect(actual).toEqual(expected);
  });

});