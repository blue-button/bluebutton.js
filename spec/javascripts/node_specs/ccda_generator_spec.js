var fs = require('fs'),
    path = require('path'),
    BlueButton = require('../../../build/bluebutton');

describe('CCDA Generation', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/ccda_expected_browser_output.json'), 'utf-8');
  var template = fs.readFileSync(path.resolve(__dirname,
    '../../../lib/generators/ccda_template.ejs'), 'utf-8');
  var bb = BlueButton(record, {
    template: template,
    generatorType: 'ccda',
    testingMode: true
  });

  var expectedOutput = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/ccda/ccda_expected_output.xml'), 'utf-8');

  it('should output the correct xml', function() {
    var actual = bb.data;
    var expected = expectedOutput;
    
    expect(actual).toEqual(expected);
  });

});