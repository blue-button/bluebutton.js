var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    BlueButton = require('../../../build/bluebutton');

describe('CCDA', function() {
  var record = fs.readFileSync(path.resolve(__dirname,
    '../../../bower_components/sample_ccdas/HL7\ Samples/CCD.sample.xml'), 'utf-8');
  var bb = BlueButton(record);

  var expectedOutput = JSON.parse(fs.readFileSync(path.resolve(__dirname,
    '../fixtures/json/ccda_expected_browser_output.json'), 'utf-8'));
  /* HL7 xml has lab effectiveTimes which are near Daylight Saving time.
   * Chrome/FF/Node (incorrectly) say a Date of 03/23/2000 is NOT in Daylight Saving time. Safari/PhantomJS say it is.
   * Here we modify the expected output for PhantomJS to fix that date for Node. */
  expectedOutput['labs'].forEach(function(lab) {
    lab['results'].forEach(function(result) {
      result['date'] = '2000-03-23T08:00:00.000Z';
    });
  });

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

});