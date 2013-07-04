/*
We're missing a proper reference implementation to test va c32 so this spec
has been renamed to _tmp to prevent it from being picked up by the jasmine task.
 */

describe('VA C32', function() {
  var record, expectedOutput, bb;

  function toJSON(target) {
    return JSON.parse(target.json())
  }
  
  beforeEach(function() {
    record = readFixtures('../../../sample_data/va_c32/VA_CCD_Sample_File_Version_12_4.xml');
    bb = BlueButton(record);
    expectedOutput = getJSONFixture('va_c32_expected_output.json');
  });

  describe('document', function() {
    it('should match the va_c32 type', function() {
      var actual = bb.document().type;
      var expected = expectedOutput.document.type;

      expect(actual).toEqual(expected);
    });
  });

  describe('allergies', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.allergies());
      var expected = expectedOutput.allergies;

      expect(actual).toEqual(expected);
    });
  });

  describe('demographics', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.demographics());
      var expected = expectedOutput.demographics;

      expect(actual).toEqual(expected);
    });
  });

  describe('encounters', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.encounters());
      var expected = expectedOutput.encounters;

      expect(actual).toEqual(expected);
    });
  });

  describe('immunizations', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.immunizations());
      var expected = expectedOutput.immunizations;

      expect(actual).toEqual(expected);
    });
  });

  describe('labs', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.labs());
      var expected = expectedOutput.labs;

      expect(actual).toEqual(expected);
    });
  });

  describe('medications', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.medications());
      var expected = expectedOutput.medications;

      expect(actual).toEqual(expected);
    });
  });

  describe('problems', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.problems());
      var expected = expectedOutput.problems;

      expect(actual).toEqual(expected);
    });
  });

  describe('procedures', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.procedures());
      var expected = expectedOutput.procedures;

      expect(actual).toEqual(expected);
    });
  });

  describe('vitals', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.vitals());
      var expected = expectedOutput.vitals;

      expect(actual).toEqual(expected);
    });
  });

  describe('data', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.data);
      var expected = expectedOutput;

      expect(actual).toEqual(expected);
    });
  });

});