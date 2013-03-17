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
  
  var emptyEl = function() {
    el = document.createElement('empty');
    el.elsByTag = Core.elsByTag;
    el.tag = Core.tag;
    el.attr = Core.attr;
    el.val = Core.val;
    return el;
  };
  
  var tagAttrVal = function (xmlDOM, tag, attr, value) {
    var el = xmlDOM.getElementsByTagName(tag);
    for (var i = 0; i < el.length; i++) {
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  var template = function(templateId) {
    var el = tagAttrVal(this, 'templateId', 'root', templateId);
    if (!el) {
      return emptyEl();
    } else {
      return el.parentElement;
    }
  };
  
  var tag = function(tag) {
    var el = this.getElementsByTagName(tag)[0];
    if (!el) {
      return emptyEl();
    } else {
      return el;
    }
  };
  
  var elsByTag = function(tag) {
    return this.getElementsByTagName(tag);
  };
  
  var attr = function(attr) {
    if (!this) { return null; }
    return this.getAttribute(attr);
  };
  
  var val = function() {
    if (!this) { return null; }
    try {
      return this.childNodes[0].nodeValue;
    } catch (e) {
      return null;
    }
  };
  
  var parseDate = function(str) {
    if (!str || typeof str !== "string") {
      console.log("Error: date is not a string");
      return null;
    }
    var year = str.substr(0, 4);
    var month = str.substr(4, 2);
    var day = str.substr(6, 2);
    return new Date(year, month, day);
  };
  
  return {
    parseXML: parseXML,
    template: template,
    tag: tag,
    elsByTag: elsByTag,
    attr: attr,
    val: val,
    parseDate: parseDate
  }
}();
