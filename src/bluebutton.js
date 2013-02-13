// bluebutton.js - The Public Object and Interface

var BlueButton = function (xml) {
  // dependancies
  // var c = Labs.a,
  //     d = Labs.b;
  
  // properties
  var xmlDOM = null,
      data = {};
  
  // public methods
  var data = function () {
    return data;
  };
  
  // init
  xmlDOM = Core.parseXML(xml);
  
  // Process document sections (XML -> JSON)
  data.immunizations = Immunizations.process(xmlDOM);
  
  return {
    // labs: c,
    // labRanges: d,
    data: data,
    xmlDOM: xmlDOM,
    immunizations: data.immunizations
  };
};

window.BlueButton = BlueButton;
