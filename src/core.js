// core.js - Essential shared functionality

var Core = function(){

  var fns = ["elsByTag", "tag", "attr", "val", "template"];

  var ElementFacade = function(elt){
    this.wrapped = elt;
    this.tagName = elt.tagName;
  };
  
  for (var i=0; i<fns.length;i++){
    (function(fname){
      ElementFacade.prototype[fname] = function(){
        return Core[fname].apply(this, arguments); 
      };
    })(fns[i]);
  }

  function wrap(e){
    if (!e) return e;
    if (e.length === undefined){
      return new ElementFacade(e);
    }
    var ret = [];
    for (var i=0; i<e.length;i++){
      ret.push(new ElementFacade(e[i]));
    }
    return ret;
  };

  var parseXML = function(data) {
    if(!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null
    }
    var xml, tmp;
    if(window.DOMParser) {
      parser = new DOMParser;
      xml = parser.parseFromString(data, "text/xml")
    }else {
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(data)
    }
    if(!xml || !xml.
    Element || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null
    }
    return wrap(xml);
  };
  var emptyEl = function() {
    el = document.createElement("empty");
    return wrap(el);
  };
  var tagAttrVal = function(xmlDOM, tag, attr, value) {
    var el = xmlDOM.getElementsByTagName(tag);
    for(var i = 0;i < el.length;i++) {
      if(el[i].getAttribute(attr) === value) {
        return el[i]
      }
    }
  };
  var template = function(templateId) {
    var el = tagAttrVal(this.wrapped, "templateId", "root", templateId);
    if(!el) {
      return emptyEl()
    }else {
      return wrap(el.parentNode);
    }
  };
  var tag = function(tag) {
    var el = this.wrapped.getElementsByTagName(tag)[0];
    if(!el) {
      return emptyEl()
    }else {
      return wrap(el);
    }
  };
  var elsByTag = function(tag) {
    return wrap(this.wrapped.getElementsByTagName(tag));
  };
  var attr = function(attr) {
    if(!this) {
      return null
    }
    return this.wrapped.getAttribute(attr);
  };
  var val = function() {
    if(!this.wrapped) {
      return null
    }
    try {
      return this.wrapped.childNodes[0].nodeValue;
    }catch(e) {
      return null
    }
  };
  var parseDate = function(str) {
    if(!str || typeof str !== "string") {
      console.log("Error: date is not a string");
      return null
    }
    var year = str.substr(0, 4);
    var month = str.substr(4, 2);
    var day = str.substr(6, 2);
    return new Date(year, month, day)
  };
  return{parseXML:parseXML, template:template, tag:tag, elsByTag:elsByTag, attr:attr, val:val, parseDate:parseDate}
}();
