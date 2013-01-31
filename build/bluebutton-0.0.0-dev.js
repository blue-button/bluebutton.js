/**
 * BlueButton.js
 */
var Core = function() {
  var parseXML = function(data) {
    if(!data || typeof data !== "string") {
      console.log("Error: XML data is not a string");
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
    return xml
  };
  var getElementByTagAttrValue = function(xmlDOM, tag, attr, value) {
    var el = xmlDOM.getElementsByTagName(tag);
    for(var i = 0;i < el.length;i++) {
      if(el[i].attributes.getNamedItem(attr).nodeValue === value) {
        return el[i]
      }
    }
  };
  return{parseXML:parseXML, getElementByTagAttrValue:getElementByTagAttrValue}
}();
var Labs = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.3.1";
  var labs = function(args) {
    return this.getData() + " labs:" + args
  };
  var ranges = function() {
  };
  var extract = function(xmlDOM) {
    var el = Core.getElementByTagAttrValue(xmlDOM, "templateId", "root", templateId);
    el = el.parentElement;
    el = el.getElementsByTagName("value");
    return el
  };
  return{a:labs, b:ranges, extract:extract}
}();
var BlueButton = function(xml) {
  var c = Labs.a, d = Labs.b;
  var xmlDOM = null, data = {};
  var getData = function() {
    return data
  };
  xmlDOM = Core.parseXML(xml);
  data.labs = Labs.extract(xmlDOM);
  return{labs:c, labRanges:d, getData:getData, xmlDOM:xmlDOM}
};
window.BlueButton = BlueButton;

