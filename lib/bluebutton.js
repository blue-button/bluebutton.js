/*
 * bluebutton.js - The public `BlueButton` object.
 */
 
var BlueButton = function (source) {
  // dependancies
  
  // properties
  var xmlDOM = null,
      type = '',
      data = {};
  
  // private methods
  var addMethods = function (objects) {
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = function () { return JSON.stringify(this, null, 2) };
    };
  };
  
  // public methods
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
  
  // init
  
  // Parse as XML
  // Remove leading and trailing whitespace
  source = source.replace(/^\s+|\s+$/g,'');
  if (source.substr(0, 5) == "<?xml") {
    xmlDOM = XML.parseXML(source);
    
    type = 'ccda';
    
    data.document = { type: type };
    data.allergies = Allergies.parse(xmlDOM);
    data.demographics  = Demographics.parse(xmlDOM);
    data.encounters = Encounters.parse(xmlDOM);
    data.immunizations = Immunizations.parse(xmlDOM);
    data.labs = Labs.parse(xmlDOM);
    data.medications = Medications.parse(xmlDOM);
    data.problems = Problems.parse(xmlDOM);
    data.procedures = Procedures.parse(xmlDOM);
    data.vitals = Vitals.parse(xmlDOM);
    
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
    
  // parse as JSON
  } else {
    type = 'json';
    
    try {
      var json = JSON.parse(source);
    } catch (e) {
      console.log("BB Exception: Could not parse JSON");
    }
  }
  
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
