/*
 * bluebutton.js - The public `BlueButton` object.
 */

/* exported BlueButton */
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
    var json = function () { return JSON.stringify(this, null, 2); };
    
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = json;
    }
  };
  
  // Public Methods
  ///////////////////////////
  var doc = function () { return data.document; };
  var allergies = function () { return data.allergies; };
  var demographics = function () { return data.demographics; };
  var encounters = function () { return data.encounters; };
  var immunizations = function () { return data.immunizations; };
  var labs = function () { return data.labs; };
  var medications = function () { return data.medications; };
  var problems = function () { return data.problems; };
  var procedures = function () { return data.procedures; };
  var vitals = function () { return data.vitals; };
  
  // Init
  ///////////////////////////
  
  // Remove leading and trailing whitespace
  source = source.replace(/^\s+|\s+$/g,'');
  
  // Detect document type
  if (source.substr(0, 5) === "<?xml") {
    xmlDOM = XML.parse(source);
    
    if (!xmlDOM.template('2.16.840.1.113883.3.88.11.32.1').isEmpty()) {
      type = "c32";
    } else if(!xmlDOM.template('2.16.840.1.113883.10.20.22.1.2').isEmpty()) {
      type = "ccda";
    }
  } else {
    type = "json";
  }
  
  switch (type) {
    case "c32":
      data = Parsers.C32.run(xmlDOM);
      break;
    case "ccda":
      data = Parsers.CCDA.run(xmlDOM);
      break;
    case "json":
      var json;
      try {
        json = JSON.parse(source);
      } catch (e) {
        console.log("BB Exception: Could not parse JSON");
      }
      console.log("BB Error: Blue Button JSON not yet implemented.");
      console.log(json);
      break;
  }
  
  data.document = { type: type };
  
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
