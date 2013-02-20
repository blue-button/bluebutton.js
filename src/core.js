// core.js - Essential shared functionality

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
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  var getSection = function(xmlDOM, templateId) {
    return getElementByTagAttrValue(xmlDOM, 'templateId', 'root', templateId);
  };
  
  var date = function(str) {
    var year = str.substr(0, 4);
    var month = str.substr(4, 2);
    var day = str.substr(6, 2);
    return new Date(year, month, day);
  };
  
  return {
    parseXML: parseXML,
    getElementByTagAttrValue: getElementByTagAttrValue,
    getSection: getSection,
    date: date
  }
}();
