var fs = require('fs'),
    path = require('path'),
    BlueButton = require('../../../build/bluebutton');

/* I generally update the expected XML by running a function like this from node:
      var refreshXml = function() {
        var fs = require('fs');
        var BlueButton = require('./build/bluebutton.js');
        var json = fs.readFileSync('./spec/javascripts/fixtures/json/hl7_ccda_expected_output.json', 'utf-8');
        var template = fs.readFileSync('./build/ccda_template.ejs', 'utf-8');
        var bb = BlueButton(json, { template: template, generatorType: 'ccda', testingMode: true });
        fs.writeFileSync('./spec/javascripts/fixtures/ccda/hl7_expected_ccda.xml', bb.data, 'utf-8');

        var json2 = fs.readFileSync('./spec/javascripts/fixtures/json/nist_ccda_expected_output.json', 'utf-8');
        var bb2 = BlueButton(json2, { template: template, generatorType: 'ccda', testingMode: true });
        fs.writeFileSync('./spec/javascripts/fixtures/ccda/nist_expected_ccda.xml', bb2.data, 'utf-8')
      };
 *
 * Then I "git diff -w" the expected XML and make sure that all the changes to the XML
 * look good before committing the new result. Obviously the manual inspection
 * before committing is pretty important, since the test below is by definition
 * guaranteed to pass after following the steps above.
 */

var runGenerationTest = function(whichTest) {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/'+whichTest+'_ccda_expected_output.json'), 'utf-8');
  var template = fs.readFileSync(path.resolve(__dirname,
      '../../../lib/generators/ccda_template.ejs'), 'utf-8');
  var bb = BlueButton(record, {
    template: template,
    generatorType: 'ccda',
    testingMode: true
  });
  
  var expectedOutput = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/ccda/'+whichTest+'_expected_ccda.xml'), 'utf-8');

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