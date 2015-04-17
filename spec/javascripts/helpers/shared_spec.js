/*
 * Verifies that the JSON parsed from some XML by BB matches the
 * contents of a fixture containing the expected JSON. Checks each
 * section (for easier debugging) before checking the whole output
 * (to make sure we don't forget to add new sections to the tests.)
 */
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

/*
 * We have our own date parsing code, because pulling in moment.js felt like too much,
 * but naive JS parsing isn't enough to handle the datetimes we get from CDAs. Add
 * to these tests if you find any date parsing falldowns. If we're doing that often...
 * suck up the filesize and pull in moment.js.
 */
var runDateParsingTests = function(Documents) {
  describe('parseDate', function() {
    var parseDate = Documents.parseDate;

    // on the left: the input you want to test
    // on the right: an ISO-8601 date-time (UTC) or a MM/DD/YYYY date-time (local time)
    var assertEquivalency = function(inputStr, expectedStr) {
      var parsed = parseDate(inputStr).getTime();
      var expected = (new Date(expectedStr)).getTime();
      expect(parsed).toEqual(expected);
    };

    it('should parse year only', function() {
      assertEquivalency('1999', '01/01/1999 00:00:00');
    });

    it('should parse year + month', function() {
      assertEquivalency('199907', '07/01/1999 00:00:00');
    });

    it('should parse year + month + day', function() {
      assertEquivalency('19990704', '07/04/1999 00:00:00');
    });

    it('should parse standard CCDA date', function() {
      assertEquivalency('20140416115439', '2014-04-16T11:54:39Z');
    });

    it('should parse CCDA date + positive timezone', function() {
      assertEquivalency('20140416115439+0700', '2014-04-16T04:54:39Z');
    });

    it('should parse CCDA date + negative timezone', function() {
      assertEquivalency('20140416115439-0500', '2014-04-16T16:54:39Z');
    });

    it('should parse CCDA date + UTC timezone', function() {
      assertEquivalency('20140416115439Z', '2014-04-16T11:54:39Z');
    });

    it('should parse CCDA date + timezone + millis', function() {
      assertEquivalency('20101026091700.000-0500', '2010-10-26T14:17:00Z');
    });

    it('should parse totally invalid date as NaN', function() {
      expect(parseDate('gobbledigook').getTime()).toBeNaN();
    });
  });
};

/*
 * Manually adjusts the JSON to account for failures of the generator that
 * we expect (basically a whitelist of expected losses of fidelity) or to
 * correct errors in the source JSON that we will not preserve.
 */
var _launderPassThroughJson = function(jsonInputStr, jsonSourceName) {
  if (jsonSourceName.toLowerCase() === 'emerge') {
    // the codeSystemName in EMERGE files differs from our convention
    return jsonInputStr.replace(/SNOMED\-CT/g, 'SNOMED CT');

  } else if (jsonSourceName.toLowerCase() === 'nist') {
    // The display name and code disagree in the source file.
    // We're going to end up relying on the display name, so fix the code to fit.
    jsonInputStr = jsonInputStr.replace('GPARNT', 'GRFTH');

    // Some modifications will be easier with the actual JSON
    var parsedJson = JSON.parse(jsonInputStr);
    // We don't generate encounter locations, because that would require adding a location
    // type code that we don't want to have to pay attention to (and the location is optional
    // but the code is not optional once you have a location)
    parsedJson.encounters.forEach(function(encounter) {
      encounter.location = {
        street: [],
        city : null,
        state : null,
        zip : null,
        country : null,
        organization : null
      };
    });
    // We could probably make this one work without new data if someone finds they care...
    parsedJson.procedures.forEach(function(procedure) {
      procedure.performer = {
        street: [],
        city : null,
        state : null,
        zip : null,
        country : null,
        organization : null,
        phone: null
      };
    });
    // If we include a med performer, there is some other data that becomes necessary
    parsedJson.medications.forEach(function(medication) {
      medication.prescriber = {
          organization: null,
          person: null
        };
    });
    return JSON.stringify(parsedJson);

  } else {
    return jsonInputStr;
  }
};

var runPassThroughTest = function(BlueButton, jsonInputStr, jsonSourceName, template) {
  // 1. Takes some initial JSON (jsonInputStr)

  // 2. Manually tweak the JSON to strip out data we know will break the
  // tests but that we don't care about
  jsonInputStr = _launderPassThroughJson(jsonInputStr, jsonSourceName);

  // 3. Generates a CCDA from it
  var bb = BlueButton(jsonInputStr, {
    template: template,
    generatorType: 'ccda',
    testingMode: true
  });
  var bbGeneratedXml = bb.data;

  // 4. Then parses the CCDA with BB again
  bb = BlueButton(bbGeneratedXml);

  // 5. And makes sure we get back what we sent in
  // (minus a whitelist of expected differences, in each of the tests below)
  runJsonTests(JSON.parse(jsonInputStr), 'ccda', bb);
};


// Node-specific code
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      runJsonTests: runJsonTests,
      runDateParsingTests: runDateParsingTests,
      runPassThroughTest: runPassThroughTest
    };
    var _ = require('underscore');
  }
}