var fs = require('fs'),
    path = require('path'),
    runJsonTests = require('../helpers/shared_spec').runJsonTests,
    BlueButton = require('../../../build/bluebutton');

describe('Emerge JSON -> CCDA -> JSON', function() {
  // start with what would usually be our "expectedJson"
  var jsonInputStr = fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/emerge_ccda_expected_output.json'), 'utf-8');

  // the codeSystemName in EMERGE files differs from our convention
  jsonInputStr = jsonInputStr.replace(/SNOMED\-CT/g, 'SNOMED CT');

  // generate a CCDA from it
  var template = fs.readFileSync(path.resolve(__dirname,
      '../../../lib/generators/ccda_template.ejs'), 'utf-8');
  var bb = BlueButton(jsonInputStr, {
    template: template,
    generatorType: 'ccda',
    testingMode: true
  });
  var bbGeneratedXml = bb.data;
  console.log(bbGeneratedXml);

  // now parse the CCDA with BB again
  bb = BlueButton(bbGeneratedXml);

  // make sure we get back what we sent in, minus a whitelist of expected differences
  runJsonTests(JSON.parse(jsonInputStr), 'ccda', bb);

});

// describe('NIST JSON -> CCDA -> JSON', function() {
//   // start with what would usually be our "expectedJson"
//   var jsonInputStr = fs.readFileSync(path.resolve(__dirname,
//     '../fixtures/json/nist_ccda_expected_output.json'), 'utf-8');

//   jsonInputStr = jsonInputStr.replace('GPARNT', 'GRFTH');

//   // generate a CCDA from it
//   var template = fs.readFileSync(path.resolve(__dirname,
//       '../../../lib/generators/ccda_template.ejs'), 'utf-8');
//   var bb = BlueButton(jsonInputStr, {
//     template: template,
//     generatorType: 'ccda',
//     testingMode: true
//   });
//   var bbGeneratedXml = bb.data;

//   // now parse the CCDA with BB again
//   bb = BlueButton(bbGeneratedXml);

//   // make sure we get back what we sent in, minus a whitelist of expected differences
//   runJsonTests(JSON.parse(jsonInputStr), 'ccda', bb);

// });