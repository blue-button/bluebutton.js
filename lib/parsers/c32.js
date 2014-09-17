/*
 * Parser for the C32 document
 */

Parsers.C32 = (function () {
  
  var run = function (c32) {
    var data = {};
    
    data.document              = Parsers.C32.document(c32);
    data.allergies             = Parsers.C32.allergies(c32);
    data.demographics          = Parsers.C32.demographics(c32);
    data.encounters            = Parsers.C32.encounters(c32);
    data.immunizations         = Parsers.C32.immunizations(c32).administered;
    data.immunization_declines = Parsers.C32.immunizations(c32).declined;
    data.results               = Parsers.C32.results(c32);
    data.medications           = Parsers.C32.medications(c32);
    data.problems              = Parsers.C32.problems(c32);
    data.procedures            = Parsers.C32.procedures(c32);
    data.vitals                = Parsers.C32.vitals(c32);
    
    data.json                       = Core.json;
    data.document.json              = Core.json;
    data.allergies.json             = Core.json;
    data.demographics.json          = Core.json;
    data.encounters.json            = Core.json;
    data.immunizations.json         = Core.json;
    data.immunization_declines.json = Core.json;
    data.results.json               = Core.json;
    data.medications.json           = Core.json;
    data.problems.json              = Core.json;
    data.procedures.json            = Core.json;
    data.vitals.json                = Core.json;

    // Sections that are in CCDA but not C32... we want to keep the API
    // consistent, even if the entries are always null
    data.smoking_status = {
      date: null,
      name: null,
      code: null,
      code_system: null,
      code_system_name: null
    };
    data.smoking_status.json = Core.json;
    
    data.chief_complaint = {
      text: null
    };
    data.chief_complaint.json = Core.json;

    data.care_plan = [];
    data.care_plan.json = Core.json;

    data.instructions = [];
    data.instructions.json = Core.json;

    data.functional_statuses = [];
    data.functional_statuses.json = Core.json;
    
    return data;
  };

  return {
    run: run
  };
  
})();
