/*
 * bluebutton.js - The public `BlueButton` object.
 */
 
var BlueButton = function (source) {
  
  // Dependancies
  ///////////////////////////
  
  // Properties
  ///////////////////////////
  var xmlDOM = null,
      type = '',
      data = {};
  
  // Private Methods
  ///////////////////////////
  var addMethods = function (objects) {
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = function () { return JSON.stringify(this, null, 2) };
    };
  };
  
  // Public Methods
  ///////////////////////////
  var doc = function () { return data.document };
  var allergies = function () { return data.allergies };
  var demographics = function () { return data.demographics };
  var encounters = function () { return data.encounters };
  var immunizations = function () { return data.immunizations };
  var labs = function () { return data.labs };
  var medications = function () { return data.medications };
  var problems = function () { return data.problems };
  var procedures = function () { return data.procedures };
  var vitals = function (filters) {
    if (filters) {
      return Core.filters(data.vitals);
    } else {
      return data.vitals;
    }
  };
  
  // Init
  ///////////////////////////
  
  // Remove leading and trailing whitespace
  source = source.replace(/^\s+|\s+$/g,'');
  
  // Detect document type
  if (source.substr(0, 5) == "<?xml") {
    xmlDOM = XML.parseXML(source);
    
    if (!xmlDOM.template('2.16.840.1.113883.3.88.11.32.1').isEmpty()) {
      type = "c32";
    } else if(!xmlDOM.template('2.16.840.1.113883.10.20.22.1.2').isEmpty()) {
      type = "ccda";
    }
  } else {
    type = "json";
  }
  
  data.document = { type: type };
  
  switch (type) {
    case "c32":
      data.allergies =     C32.Allergies.parse(xmlDOM);
      data.demographics =  C32.Demographics.parse(xmlDOM);
      data.encounters =    C32.Encounters.parse(xmlDOM);
      data.immunizations = C32.Immunizations.parse(xmlDOM);
      data.labs =          C32.Labs.parse(xmlDOM);
      data.medications =   C32.Medications.parse(xmlDOM);
      data.problems =      C32.Problems.parse(xmlDOM);
      data.procedures =    C32.Procedures.parse(xmlDOM);
      data.vitals =        C32.Vitals.parse(xmlDOM);
      break;
    case "ccda":
      data.allergies =     CCDA.Allergies.parse(xmlDOM);
      data.demographics =  CCDA.Demographics.parse(xmlDOM);
      data.encounters =    CCDA.Encounters.parse(xmlDOM);
      data.immunizations = CCDA.Immunizations.parse(xmlDOM);
      data.labs =          CCDA.Labs.parse(xmlDOM);
      data.medications =   CCDA.Medications.parse(xmlDOM);
      data.problems =      CCDA.Problems.parse(xmlDOM);
      data.procedures =    CCDA.Procedures.parse(xmlDOM);
      data.vitals =        CCDA.Vitals.parse(xmlDOM);
      break;
    case "json":
      try {
        var json = JSON.parse(source);
      } catch (e) {
        console.log("BB Exception: Could not parse JSON");
      }
      console.log("BB Error: Blue Button JSON not yet implemented.");
      break;
  }
  
  addMethods([
    data,
    data.document,
    data.allergies,
    data.demographics,
    data.encounters,
    data.immunizations,
    data.labs,
    data.medications,
    data.problems,
    data.procedures,
    data.vitals
  ]);
  
  // Reveal public methods
  return {
    xmlDOM: xmlDOM,
    data: data,
    document: doc,
    allergies: allergies,
    demographics: demographics,
    encounters: encounters,
    immunizations: immunizations,
    labs: labs,
    medications: medications,
    problems: problems,
    procedures: procedures,
    vitals: vitals
  };
    
};
