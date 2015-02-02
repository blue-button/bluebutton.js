var BlueButton = require('../../../build/bluebutton'),
    runDateParsingTests = require('../helpers/shared_spec').runDateParsingTests,
    Documents = require('../../../lib/documents');

describe("BlueButton", function() {
  
  it("should exist", function() {
    expect(BlueButton).toBeDefined();
  });

  runDateParsingTests(Documents);

});