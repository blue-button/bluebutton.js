// immunizations.js - Laboratory Results

var Immunizations = function () {
  
  // dependancies
  
  // properties
  var templateId = '2.16.840.1.113883.10.20.22.2.2';
  
  // methods
  var process = function (xmlDOM) {
    var data = [],
        entries,
        el;
        
    el = Core.getSection(xmlDOM, templateId);
    entries = el.parentElement.getElementsByTagName('entry');
    
    for (var i = 0; i < entries.length; i++) {
      // date
      el = entries[i].getElementsByTagName('effectiveTime')[0];
      var date = el.getAttribute('value');
      
      // product
      el = entries[i].getElementsByTagName('consumable')[0];
      el = el.getElementsByTagName('code')[0];
      var product_name = el.getAttribute('displayName');
      var product_code = el.getAttribute('code');
      var product_hl7_code_system = el.getAttribute('codeSystem');
      var product_code_system_name = el.getAttribute('codeSystemName');
      
      // route
      el = entries[i].getElementsByTagName('routeCode')[0];
      var route_name = el.getAttribute('displayName');
      var route_code = el.getAttribute('code');
      var route_code_system = el.getAttribute('codeSystem');
      var route_code_system_name = el.getAttribute('codeSystemName');
      
      // instructions
      el = entries[i].getElementsByTagName('entryRelationship')[0];
      var codeTag = el.getElementsByTagName('code')[0];
      var instructions_name = codeTag.getAttribute('displayName');
      var instructions_text = el.getElementsByTagName('text')[0].childNodes[0].nodeValue;
      var instructions_code = codeTag.getAttribute('code');
      var instructions_code_system = codeTag.getAttribute('codeSystem');
      
      // translation
      el = entries[i].getElementsByTagName('translation')[0];
      var translation_name = el.getAttribute('displayName');
      var translation_code = el.getAttribute('code');
      var translation_code_system = el.getAttribute('codeSystem');
      var translation_code_system_name = el.getAttribute('codeSystemName');
      
      data.push({
        date: date,
        product: {
          name: product_name,
          code: product_code,
          hl7_code_system: product_hl7_code_system,
          code_system_name: product_code_system_name
        },
        route: {
          name: route_name,
          code: route_code,
          code_system: route_code_system,
          code_system_name: route_code_system_name
        },
        instructions: {
          name: instructions_name,
          text: instructions_text,
          code: instructions_code,
          code_system: instructions_code_system
        },
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        }
      });
    }
    return data;
  };
  
  return {
    process: process
  };

}();
