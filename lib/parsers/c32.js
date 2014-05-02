/*
 * Parser for the C32 document
 */

Parsers.C32 = function (c32) {
  
  var data = {};
  
  data.document      = Parsers.c32.document(c32);
  data.allergies     = Parsers.c32.allergies(c32);
  data.demographics  = Parsers.c32.demographics(c32);
  data.encounters    = Parsers.c32.encounters(c32);
  data.immunizations = Parsers.c32.immunizations(c32);
  data.labs          = Parsers.c32.labs(c32);
  data.medications   = Parsers.c32.medications(c32);
  data.problems      = Parsers.c32.problems(c32);
  data.procedures    = Parsers.c32.procedures(c32);
  data.vitals        = Parsers.c32.vitals(c32);
  
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
