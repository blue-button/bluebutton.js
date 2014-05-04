/*
 * Parser for the CCDA document
 */

Parsers.CCDA = (function () {
  
  var run = function (ccda) {
    var data = {};
    
    data.document      = Parsers.CCDA.document(ccda);
    data.allergies     = Parsers.CCDA.allergies(ccda);
    data.demographics  = Parsers.CCDA.demographics(ccda);
    data.encounters    = Parsers.CCDA.encounters(ccda);
    data.immunizations = Parsers.CCDA.immunizations(ccda);
    data.labs          = Parsers.CCDA.labs(ccda);
    data.medications   = Parsers.CCDA.medications(ccda);
    data.problems      = Parsers.CCDA.problems(ccda);
    data.procedures    = Parsers.CCDA.procedures(ccda);
    data.vitals        = Parsers.CCDA.vitals(ccda);
    
    data.json               = Core.json;
    data.document.json      = Core.json;
    data.allergies.json     = Core.json;
    data.demographics.json  = Core.json;
    data.encounters.json    = Core.json;
    data.immunizations.json = Core.json;
    data.labs.json          = Core.json;
    data.medications.json   = Core.json;
    data.problems.json      = Core.json;
    data.procedures.json    = Core.json;
    data.vitals.json        = Core.json;
    
    return data;
  };
  
  return {
    run: run
  };
  
})();
