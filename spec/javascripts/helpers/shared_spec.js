var runJsonTests = function(expectedOutput, expectedType, bb) {

  function toJSON(target) {
    return JSON.parse(target.json());
  }

  describe('type', function() {
    it('should match the document type', function() {
      var actual = bb.type;
      var expected = expectedType;

      expect(actual).toEqual(expected);
    });
  });

  describe('document', function() {
    it('should match the document metadata', function() {
      var actual = toJSON(bb.data.document);
      var expected = expectedOutput.document;

      expect(actual).toEqual(expected);
    });
  });

  describe('allergies', function() {
    var allergies = toJSON(bb.data.allergies);
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
      var actual = toJSON(bb.data.demographics);
      var expected = expectedOutput.demographics;
      expect(actual).toEqual(expected);
    });
  });

  describe('encounters', function() {
    var encounters = toJSON(bb.data.encounters);
    _.each(encounters, function(actual, i) {
      it('should output the correct encounter at index['+i+']', function() {
        var expected = expectedOutput.encounters[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('immunizations', function() {
    var immunizations = toJSON(bb.data.immunizations);
    _.each(immunizations, function(actual, i) {
      it('should output the correct immunization at index['+i+']', function() {
        var expected = expectedOutput.immunizations[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('immunization_declines', function() {
    var immunization_declines = toJSON(bb.data.immunization_declines);
    _.each(immunization_declines, function(actual, i) {
      it('should output the correct immunization decline at index['+i+']', function() {
        var expected = expectedOutput.immunization_declines[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('results', function() {
    var results = toJSON(bb.data.results);
    _.each(results, function(actual, i) {
      it('should output the correct lab at index['+i+']', function() {
        var expected = expectedOutput.results[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('medications', function() {
    var medications = toJSON(bb.data.medications);
    _.each(medications, function(actual, i) {
      it('should output the correct medication at index['+i+']', function() {
        var expected = expectedOutput.medications[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('problems', function() {
    var problems = toJSON(bb.data.problems);
    _.each(problems, function(actual, i) {
      it('should output the correct problem at index['+i+']', function() {
        var expected = expectedOutput.problems[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('procedures', function() {
    var procedures = toJSON(bb.data.procedures);
    _.each(procedures, function(actual, i) {
      it('should output the correct procedure at index['+i+']', function() {
        var expected = expectedOutput.procedures[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('vitals', function() {
    var vitals = toJSON(bb.data.vitals);
    _.each(vitals, function(actual, i) {
      it('should output the correct vital at index['+i+']', function() {
        var expected = expectedOutput.vitals[i];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('smoking status', function() {
    it('should output the correct smoking_status', function() {
      var actual = toJSON(bb.data.smoking_status);
      var expected = expectedOutput.smoking_status;

      expect(actual).toEqual(expected);
    });
  });

  describe('care plan', function() {
    it('should output the correct care_plan', function() {
      var actual = toJSON(bb.data.care_plan);
      var expected = expectedOutput.care_plan;

      expect(actual).toEqual(expected);
    });
  });

  describe('instructions', function() {
    it('should output the correct instructions', function() {
      var actual = toJSON(bb.data.instructions);
      var expected = expectedOutput.instructions;

      expect(actual).toEqual(expected);
    });
  });

  describe('functional statuses', function() {
    it('should output the correct functional_statuses', function() {
      var actual = toJSON(bb.data.functional_statuses);
      var expected = expectedOutput.functional_statuses;

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

};

// Node-specific code
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = runJsonTests;
    var _ = require('underscore');
  }
}