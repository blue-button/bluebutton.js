// bluebutton.js - The Public Object and Interface

var BlueButton = function (xml) {
  // dependancies
  
  // properties
  var xmlDOM = null,
      data = {};
  
  // private methods
  var addMethods = function (objects) {
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = function () { return JSON.stringify(this, null, 2) };
    };
  };
  
  // public methods
  var allergies = function () { return data.allergies };
  var demographics = function () { return data.demographics };
  var discharge = function () { return data.discharge };
  var encounters = function () { return data.encounters };
  var functions = function () { return data.functions };
  var history = function () { return data.history };
  var immunizations = function () { return data.immunizations };
  var labs = function () { return data.labs };
  var medications = function () { return data.medications };
  var plan = function () { return data.plan };
  var problems = function () { return data.problems };
  var procedures = function () { return data.procedures };
  var vitals = function () { return data.vitals };
  
  // init
  xmlDOM = Core.parseXML(xml);
  
  data.allergies = Allergies.process(xmlDOM);
  data.demographics  = Demographics.process(xmlDOM);
  data.discharge = Discharge.process(xmlDOM);
  data.encounters = Encounters.process(xmlDOM);
  data.functions = Functions.process(xmlDOM);
  data.history = History.process(xmlDOM);
  data.immunizations = Immunizations.process(xmlDOM);
  data.labs = Labs.process(xmlDOM);
  data.medications = Medications.process(xmlDOM);
  data.plan = Plan.process(xmlDOM);
  data.problems = Problems.process(xmlDOM);
  data.procedures = Procedures.process(xmlDOM);
  data.vitals = Vitals.process(xmlDOM);
  
  addMethods([
    data.allergies,
    data.demographics,
    data.discharge,
    data.encounters,
    data.functions,
    data.history,
    data.immunizations,
    data.labs,
    data.medications,
    data.plan,
    data.problems,
    data.procedures,
    data.vitals
  ]);
  
  return {
    data: data,
    xmlDOM: xmlDOM,
    allergies: allergies,
    demographics: demographics,
    discharge: discharge,
    encounters: encounters,
    functions: functions,
    history: history,
    immunizations: immunizations,
    labs: labs,
    medications: medications,
    plan: plan,
    problems: problems,
    procedures: procedures,
    vitals: vitals
  };
};

window.BlueButton = BlueButton;
