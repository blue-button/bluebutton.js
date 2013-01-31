// bluebutton.js - The Public Object and Interface

var BlueButton = function (xml) {
  // dependancies
  var c = Labs.a,
      d = Labs.b;
  
  // properties
  var xmlDOM = null,
      data = {};
  
  // public methods
  var getData = function () {
    return data;
  };
  
  // init
  xmlDOM = Core.parseXML(xml);
  data.labs = Labs.extract(xmlDOM);
  
  return {
    labs: c,
    labRanges: d,
    getData: getData,
    xmlDOM: xmlDOM
    // Meds.meds: meds,
    // Meds.types: medTypes
  };
};

window.BlueButton = BlueButton;
