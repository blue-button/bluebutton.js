// immunizations.js - Laboratory Results

var Immunizations = function () {
  
  // dependancies
  
  // properties
  var templateId = "2.16.840.1.113883.10.20.22.2.2";
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    var el = Core.getElementByTagAttrValue(xmlDOM, 'templateId',
                                           'root', templateId);
    var entries = el.parentElement.getElementsByTagName('entry');
    
    for (var i = 0; i < entries.length; i++) {
      var date = entries[i].getElementsByTagName('effectiveTime');
      
      data.push({
        date: date
      });
    }
    
    // template < section > get array of entries
    // > entry > <effectiveTime xsi:type="IVL_TS" value="199911"/>
    // > entry > <routeCode code="IM" codeSystem="2.16.840.1.113883.5.112" codeSystemName="RouteOfAdministration" displayName="Intramuscular injection"/>
    
    return data;
  };
  
  return {
    process: process
  };

}();
