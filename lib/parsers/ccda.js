/*
 * Parser for the CCDA document
 */

Parsers.CCDA = (function () {
  
  var run = function (ccda) {
    var data = {};
    
    data.document              = Parsers.CCDA.document(ccda);
    data.allergies             = Parsers.CCDA.allergies(ccda);
    data.care_plan             = Parsers.CCDA.care_plan(ccda);
    data.chief_complaint       = Parsers.CCDA.free_text(ccda, 'chief_complaint');
    data.demographics          = Parsers.CCDA.demographics(ccda);
    data.encounters            = Parsers.CCDA.encounters(ccda);
    data.functional_statuses   = Parsers.CCDA.functional_statuses(ccda);
    data.immunizations         = Parsers.CCDA.immunizations(ccda).administered;
    data.immunization_declines = Parsers.CCDA.immunizations(ccda).declined;
    data.instructions          = Parsers.CCDA.instructions(ccda);
    data.results               = Parsers.CCDA.results(ccda);
    data.medications           = Parsers.CCDA.medications(ccda);
    data.problems              = Parsers.CCDA.problems(ccda);
    data.procedures            = Parsers.CCDA.procedures(ccda);
    data.smoking_status        = Parsers.CCDA.smoking_status(ccda);
    data.vitals                = Parsers.CCDA.vitals(ccda);
    
    data.json                        = Core.json;
    data.document.json               = Core.json;
    data.allergies.json              = Core.json;
    data.care_plan.json              = Core.json;
    data.chief_complaint.json        = Core.json;
    data.demographics.json           = Core.json;
    data.encounters.json             = Core.json;
    data.functional_statuses.json    = Core.json;
    data.immunizations.json          = Core.json;
    data.immunization_declines.json  = Core.json;
    data.instructions.json           = Core.json;
    data.results.json                = Core.json;
    data.medications.json            = Core.json;
    data.problems.json               = Core.json;
    data.procedures.json             = Core.json;
    data.smoking_status.json         = Core.json;
    data.vitals.json                 = Core.json;
    
    return data;
  };

  return {
    run: run
  };
  
})();
