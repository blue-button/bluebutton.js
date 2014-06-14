var runGenerationTest = function(whichTest) {
  var record = readFixtures('../fixtures/json/'+whichTest+'_ccda_expected_output.json');
  var template = readFixtures('../../../lib/generators/ccda_template.ejs');
  var expectedOutput = readFixtures('../fixtures/ccda/'+whichTest+'_expected_ccda.xml');
  
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
};

describe('HL7 CCDA Generation', function() {
  runGenerationTest('hl7');
});

describe('NIST CCDA Generation', function() {
  runGenerationTest('nist');

});