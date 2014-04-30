/*
 * Parser for the C32 document
 */

Parsers.C32 = (function () {
  
  var run = function (c32) {
    var data = {};
    
    data.document      = Parsers.C32.document(c32);
    data.allergies     = Parsers.C32.allergies(c32);
    data.demographics  = Parsers.C32.demographics(c32);
    data.encounters    = Parsers.C32.encounters(c32);
    data.immunizations = Parsers.C32.immunizations(c32);
    data.labs          = Parsers.C32.labs(c32);
    data.medications   = Parsers.C32.medications(c32);
    data.problems      = Parsers.C32.problems(c32);
    data.procedures    = Parsers.C32.procedures(c32);
    data.vitals        = Parsers.C32.vitals(c32);

    // Smoking status, for consistency with the CCDA API.
    // It's not actually part of the C32 spec, so it's always null.
    data.smoking_status = {
      date: null,
      name: null,
      code: null,
      code_system: null,
      code_system_name: null
    };
    
    data.json                 = Core.json;
    data.document.json        = Core.json;
    data.allergies.json       = Core.json;
    data.demographics.json    = Core.json;
    data.encounters.json      = Core.json;
    data.immunizations.json   = Core.json;
    data.labs.json            = Core.json;
    data.medications.json     = Core.json;
    data.problems.json        = Core.json;
    data.procedures.json      = Core.json;
    data.smoking_status.json  = Core.json;
    data.vitals.json          = Core.json;
    
    return data;
  };

  return {
    run: run
  };
  
})();
