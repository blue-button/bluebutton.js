/*
 * BlueButton.js
 * http://www.va.gov/bluebutton/
 * Version: 0.0.0
 */


(function() {
  
  "use strict";
  
  ///////////////////////
  // Static functionality
  var Core = function() {
    
    var convert = function (xml) {
      // Must be a string
      if (!data || typeof data !== "string") {
        return null;
      }
      
      return xml;
    };
    
    // Cross-browser XML parsing
    var parseXML = function (data) {
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
    
    return {
      convert: convert,
      parseXML: parseXML
    }
  }();
  
  
  var Labs = function () {
    
    var labs = function (args) {
      return this.getData() + ' labs:' + args;
    };
    
    var ranges = function () {
    };
    
    return {
      a: labs,
      b: ranges
    };
  
  }();
  
  
  /////////////////////////////
  // BlueButton instance object
  var BlueButton = function (xml) {
    // dependancies
    var c = Labs.a,
        d = Labs.b;
    
    // properties
    var data = null;
    
    var getData = function () {
      return data;
    };
    
    // init
    data = Core.convert(xml);
    
    return {
      labs: c,
      labRanges: d,
      getData: getData
      // Meds.meds: meds,
      // Meds.types: medTypes
    };
  };
  
  
  window.BlueButton = BlueButton;
  
})();
