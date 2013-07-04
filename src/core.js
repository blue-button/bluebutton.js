// core.js - Essential shared functionality

var Core = function () {

  // Establish the root object, `window` in the browser, or `global` in Node.
  var root = this,
      jsdom = undefined,
      isNode = false,
      doc = root.document; // Will be `undefined` if we're in Node

  // Check if we're in Node. If so, pull in jsdom so we can
  // simulate the DOM
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      isNode = true;
      jsdom = require("jsdom");
      doc = new (jsdom.level(1, "core").Document)();
    }
  }

  // properties
  var ElementWrapper = function (el) {
    return {
      el: el,
      template: template,
      tag: tag,
      elsByTag: elsByTag,
      attr: attr,
      val: val,
      isEmpty: isEmpty
    }
  };
  
  // methods
  
  // Cross-browser XML parsing
  var parseXML = function (data) {
    // Must be a string
    if (!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null;
    }
    
    var xml, tmp;

    // Node
    if (isNode) {
      xml = jsdom.jsdom(data, jsdom.level(1, "core"));
    // Browser
    } else {
      // Standard parser
      if (window.DOMParser) {
        parser = new DOMParser();
        xml = parser.parseFromString(data, "text/xml");
        
      // IE
      } else {
        try {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        } catch (e) {
          console.log("BB ActiveX Exception: Could not parse XML");
        }
      }
    }

    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null;
    }
    
    return wrapElement(xml);
  };
  
  var wrapElement = function (el) {
    // el is an array of elements
    if (el.length) {
      var els = [];
      for (var i = 0; i < el.length; i++) {
        els.push(ElementWrapper(el[i]));
      }
      return els;
    
    // el is a single element
    } else {
      return ElementWrapper(el);
    }
  };
  
  var emptyEl = function () {
    var el = doc.createElement('empty');
    return wrapElement(el);
  };
  
  var tagAttrVal = function (el, tag, attr, value) {
    el = el.getElementsByTagName(tag);
    for (var i = 0; i < el.length; i++) {
      // Workaround a bug in jsdom https://github.com/tmpvar/jsdom/issues/651
      attr = isNode ? attr.toLowerCase() : attr;
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  var template = function (templateId) {
    var el = tagAttrVal(this.el, 'templateId', 'root', templateId);
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el.parentNode);
    }
  };
  
  var tag = function (tag) {
    var el = this.el.getElementsByTagName(tag)[0];
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el);
    }
  };
  
  var elsByTag = function (tag) {
    return wrapElement(this.el.getElementsByTagName(tag));
  };
  
  var attr = function (attr) {
    if (!this.el) { return null; }
    // Workaround a bug in jsdom https://github.com/tmpvar/jsdom/issues/651
    attr = isNode ? attr.toLowerCase() : attr;
    return this.el.getAttribute(attr);
  };
  
  var val = function () {
    if (!this.el) { return null; }
    try {
      return this.el.childNodes[0].nodeValue;
    } catch (e) {
      return null;
    }
  };
  
  var isEmpty = function () {
    if (this.el.tagName.toLowerCase() == 'empty') {
      return true;
    } else {
      return false;
    }
  };
  
  var parseDate = function (str) {
    if (!str || typeof str !== "string") {
      console.log("Error: date is not a string");
      return null;
    }
    var year = str.substr(0, 4);
    // months start at 0, because why not
    var month = parseInt(str.substr(4, 2)) - 1;
    var day = str.substr(6, 2);
    return new Date(year, month, day);
  };
  
  var trim = function (o) {
    var y;
    for (var x in o) {
      y = o[x];
      // if (y === null || (y instanceof Object && Object.keys(y).length == 0)) {
      if (y === null) {
        delete o[x];
      }
      if (y instanceof Object) y = trim(y);
    }
    return o;
  }
  
  return {
    parseXML: parseXML,
    parseDate: parseDate,
    trim: trim
  };
  
}();
