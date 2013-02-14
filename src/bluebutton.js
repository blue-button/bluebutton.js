// bluebutton.js - The Public Object and Interface

var BlueButton = function (xml) {
  // dependancies
  // var c = Labs.a,
  //     d = Labs.b;
  
  // properties
  var xmlDOM = null,
      data = {},
      json = "";
  
  // init
  xmlDOM = Core.parseXML(xml);
  
  // Process document sections (XML -> JSON)
  data.immunizations = Immunizations.process(xmlDOM);
  json = JSON.stringify(data, null, 2);
  
  
  return {
    // labs: c,
    // labRanges: d,
    data: data,
    json: json,
    xmlDOM: xmlDOM,
    immunizations: data.immunizations
  };
};

window.BlueButton = BlueButton;
