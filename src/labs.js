// labs.js - Laboratory Results

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
