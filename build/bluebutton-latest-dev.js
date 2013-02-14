/**
 * BlueButton.js
 */

// v.0.0.1

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
      if(el[i].getAttribute(attr) === value) {
        return el[i]
      }
    }
  };
  var getSection = function(xmlDOM, templateId) {
    return getElementByTagAttrValue(xmlDOM, "templateId", "root", templateId)
  };
  return{parseXML:parseXML, getElementByTagAttrValue:getElementByTagAttrValue, getSection:getSection}
}();
var Immunizations = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.2";
  var process = function(xmlDOM) {
    var data = [], entries, el;
    el = Core.getSection(xmlDOM, templateId);
    entries = el.parentElement.getElementsByTagName("entry");
    for(var i = 0;i < entries.length;i++) {
      el = entries[i].getElementsByTagName("effectiveTime")[0];
      var date = el.getAttribute("value");
      el = entries[i].getElementsByTagName("consumable")[0];
      el = el.getElementsByTagName("code")[0];
      var product_name = el.getAttribute("displayName");
      var product_code = el.getAttribute("code");
      var product_hl7_code_system = el.getAttribute("codeSystem");
      var product_code_system_name = el.getAttribute("codeSystemName");
      el = entries[i].getElementsByTagName("routeCode")[0];
      var route_name = el.getAttribute("displayName");
      var route_code = el.getAttribute("code");
      var route_code_system = el.getAttribute("codeSystem");
      var route_code_system_name = el.getAttribute("codeSystemName");
      el = entries[i].getElementsByTagName("entryRelationship")[0];
      var codeTag = el.getElementsByTagName("code")[0];
      var instructions_name = codeTag.getAttribute("displayName");
      var instructions_text = el.getElementsByTagName("text")[0].childNodes[0].nodeValue;
      var instructions_code = codeTag.getAttribute("code");
      var instructions_code_system = codeTag.getAttribute("codeSystem");
      el = entries[i].getElementsByTagName("translation")[0];
      var translation_name = el.getAttribute("displayName");
      var translation_code = el.getAttribute("code");
      var translation_code_system = el.getAttribute("codeSystem");
      var translation_code_system_name = el.getAttribute("codeSystemName");
      data.push({date:date, product:{name:product_name, code:product_code, hl7_code_system:product_hl7_code_system, code_system_name:product_code_system_name}, route:{name:route_name, code:route_code, code_system:route_code_system, code_system_name:route_code_system_name}, instructions:{name:instructions_name, text:instructions_text, code:instructions_code, code_system:instructions_code_system}, translation:{name:translation_name, code:translation_code, code_system:translation_code_system, code_system_name:translation_code_system_name}})
    }
    return data
  };
  return{process:process}
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
  var xmlDOM = null, data = {}, json = "";
  xmlDOM = Core.parseXML(xml);
  data.immunizations = Immunizations.process(xmlDOM);
  json = JSON.stringify(data, null, 2);
  return{data:data, json:json, xmlDOM:xmlDOM, immunizations:data.immunizations}
};
window.BlueButton = BlueButton;

