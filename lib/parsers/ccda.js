/*
 * Parser for the CCDA document
 */

Parsers.ccda = function (ccda) {
  
  var data = {};
  
  data.document      = Parsers.ccda.document(ccda);
  data.allergies     = Parsers.ccda.allergies(ccda);
  data.demographics  = Parsers.ccda.demographics(ccda);
  data.encounters    = Parsers.ccda.encounters(ccda);
  data.immunizations = Parsers.ccda.immunizations(ccda);
  data.labs          = Parsers.ccda.labs(ccda);
  data.medications   = Parsers.ccda.medications(ccda);
  data.problems      = Parsers.ccda.problems(ccda);
  data.procedures    = Parsers.ccda.procedures(ccda);
  data.vitals        = Parsers.ccda.vitals(ccda);
  
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
