define(['../../../build/bluebutton'], function(BlueButton) {
  describe('CCDA', function() {
    var record = readFixtures('../../../bower_components/sample_ccdas/HL7%20Samples/CCD.sample.xml');
    var expectedOutput = getJSONFixture('ccda_expected_browser_output.json');
    var bb = BlueButton(record);

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
      $.each(allergies, function(i, actual) {
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
      $.each(encounters, function(i, actual) {
        it('should output the correct encounter at index['+i+']', function() {
          var expected = expectedOutput.encounters[i];
          expect(actual).toEqual(expected);
        });
      });
    });

    describe('immunizations', function() {
      var immunizations = toJSON(bb.immunizations());
      $.each(immunizations, function(i, actual) {
        it('should output the correct immunization at index['+i+']', function() {
          var expected = expectedOutput.immunizations[i];
          expect(actual).toEqual(expected);
        });
      });
    });

    describe('labs', function() {
      var labs = toJSON(bb.labs());
      $.each(labs, function(i, actual) {
        it('should output the correct lab at index['+i+']', function() {
          var expected = expectedOutput.labs[i];
          expect(actual).toEqual(expected);
        });
      });
    });

    describe('medications', function() {
      var medications = toJSON(bb.medications());
      $.each(medications, function(i, actual) {
        it('should output the correct medication at index['+i+']', function() {
          var expected = expectedOutput.medications[i];
          expect(actual).toEqual(expected);
        });
      });
    });

    describe('problems', function() {
      var problems = toJSON(bb.problems());
      $.each(problems, function(i, actual) {
        it('should output the correct problem at index['+i+']', function() {
          var expected = expectedOutput.problems[i];
          expect(actual).toEqual(expected);
        });
      });
    });

    describe('procedures', function() {
      var procedures = toJSON(bb.procedures());
      $.each(procedures, function(i, actual) {
        it('should output the correct procedure at index['+i+']', function() {
          var expected = expectedOutput.procedures[i];
          expect(actual).toEqual(expected);
        });
      });
    });

    describe('vitals', function() {
      var vitals = toJSON(bb.vitals());
      $.each(vitals, function(i, actual) {
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

  });
});