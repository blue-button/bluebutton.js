/*
 * BlueButton.js
 * http://www.va.gov/bluebutton/
 * Version: 0.0.0
 */

"use strict";

// Static Modules

var Core = function() {
  
  // Cross-browser XML parsing
  var parseXML = function (data) {
    
    // Must be a string
    if (!data || typeof data !== "string") {
      console.log("Error: XML data is not a string");
      return null;
    }
    
    var xml, tmp;
    
    // Standard parser
    if (window.DOMParser) {
      parser = new DOMParser();
      xml = parser.parseFromString(data, "text/xml");
    
    // IE
    } else {
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(data);
    }
    
    return xml;
  };
  
  var getElementByTagAttrValue = function (xmlDOM, tag, attr, value) {
    var el = xmlDOM.getElementsByTagName(tag);
    
    for (var i = 0; i < el.length; i++) {
      if (el[i].attributes.getNamedItem(attr).nodeValue === value) {
        return el[i];
      }
    }
  };
  
  return {
    parseXML: parseXML,
    getElementByTagAttrValue: getElementByTagAttrValue
  }
}();


var Labs = function () {
  
  // dependancies
  
  // properties
  var templateId = "2.16.840.1.113883.10.20.22.2.3.1";
  
  // methods
  var labs = function (args) {
    return this.getData() + ' labs:' + args;
  };
  
  var ranges = function () {};
  
  var extract = function (xmlDOM) {
    var el = Core.getElementByTagAttrValue(xmlDOM, 'templateId',
                                           'root', templateId);
    el = el.parentElement;
    el = el.getElementsByTagName('value');
    return el;
  };
  
  return {
    a: labs,
    b: ranges,
    extract: extract
  };

}();


// BlueButton instance object

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
