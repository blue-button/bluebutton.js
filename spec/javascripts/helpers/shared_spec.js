var runJsonTests = function(expectedOutput, bb) {

  function toJSON(target) {
    return JSON.parse(target.json())
  }

  describe('document', function() {
    it('should match the ccda type', function() {
      var actual = bb.document().type;
      var expected = expectedOutput.document.type;

      expect(actual).toEqual(expected);
    });
  });

  describe('allergies', function() {
    var allergies = toJSON(bb.allergies());
    _.each(allergies, function(actual, i) {
      it('should output the correct allergy at index['+i+']', function() {
        var expected = expectedOutput.allergies[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  // We don't iterate over demographics because it's just an object,
  // not an array of objects like everything else.
  describe('demographics', function() {
    it('should output the correct demographics', function() {
      var actual = toJSON(bb.demographics());
      var expected = expectedOutput.demographics;
      expect(actual).toEqual(expected);
    });
  });

  describe('encounters', function() {
    var encounters = toJSON(bb.encounters());
    _.each(encounters, function(actual, i) {
      it('should output the correct encounter at index['+i+']', function() {
        var expected = expectedOutput.encounters[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('immunizations', function() {
    var immunizations = toJSON(bb.immunizations());
    _.each(immunizations, function(actual, i) {
      it('should output the correct immunization at index['+i+']', function() {
        var expected = expectedOutput.immunizations[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('labs', function() {
    var labs = toJSON(bb.labs());
    _.each(labs, function(actual, i) {
      it('should output the correct lab at index['+i+']', function() {
        var expected = expectedOutput.labs[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('medications', function() {
    var medications = toJSON(bb.medications());
    _.each(medications, function(actual, i) {
      it('should output the correct medication at index['+i+']', function() {
        var expected = expectedOutput.medications[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('problems', function() {
    var problems = toJSON(bb.problems());
    _.each(problems, function(actual, i) {
      it('should output the correct problem at index['+i+']', function() {
        var expected = expectedOutput.problems[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('procedures', function() {
    var procedures = toJSON(bb.procedures());
    _.each(procedures, function(actual, i) {
      it('should output the correct procedure at index['+i+']', function() {
        var expected = expectedOutput.procedures[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('vitals', function() {
    var vitals = toJSON(bb.vitals());
    _.each(vitals, function(actual, i) {
      it('should output the correct vital at index['+i+']', function() {
        var expected = expectedOutput.vitals[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('data', function() {
    it('should output the correct json', function() {
      var actual = toJSON(bb.data);
      var expected = expectedOutput;

      expect(actual).toEqual(expected);
    });
  });

};

// Node-specific code
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = runJsonTests;
    var _ = require('underscore');
  }
}