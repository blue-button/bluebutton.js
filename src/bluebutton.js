// bluebutton.js - The Public Object and Interface

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
  var vitals = function () { return data.vitals };
  
  // init
  
  // Parse as XML
  // Remove leading and trailing whitespace
  source = source.replace(/^\s+|\s+$/g,'');
  if (source.substr(0, 5) == "<?xml") {
    xmlDOM = Core.parseXML(source);
    
    // Detect document type (CCDA or VA C32)
    if (xmlDOM.template('1.3.6.1.4.1.19376.1.5.3.1.1.1')
      .el.tagName.toLowerCase() == 'empty') {
      type = 'ccda';
    } else {
      type = 'va_c32';
    }
    
    data.document = { type: type };
    data.allergies = Allergies.process(xmlDOM, type);
    data.demographics  = Demographics.process(xmlDOM, type);
    data.encounters = Encounters.process(xmlDOM, type);
    data.immunizations = Immunizations.process(xmlDOM, type);
    data.labs = Labs.process(xmlDOM, type);
    data.medications = Medications.process(xmlDOM, type);
    data.problems = Problems.process(xmlDOM, type);
    data.procedures = Procedures.process(xmlDOM, type);
    data.vitals = Vitals.process(xmlDOM, type);
    
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
    
    data.document = { type: type };
    data.allergies = Allergies.process(json, type);
    data.demographics  = Demographics.process(json, type);
    data.encounters = Encounters.process(json, type);
    data.immunizations = Immunizations.process(json, type);
    data.labs = Labs.process(json, type);
    data.medications = Medications.process(json, type);
    data.problems = Problems.process(json, type);
    data.procedures = Procedures.process(json, type);
    data.vitals = Vitals.process(json, type);
  }
  
  return {
    data: data,
    xmlDOM: xmlDOM,
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

window.BlueButton = BlueButton;
