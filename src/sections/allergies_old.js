// allergies.js

var Allergies = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var CCDASectionTemplateID = '2.16.840.1.113883.10.20.22.2.6.1';
  var C32SectionTemplateID = '2.16.840.1.113883.3.88.11.83.102';
  
  // methods
  var process = function (xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    
    if (type == 'ccda') {
      templateID = CCDASectionTemplateID;
    } else {
      templateID = C32SectionTemplateID;
    }
    
    el = xmlDOM.template(templateID);
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      // value => reaction_type
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('value');
      var reaction_type_name = el.attr('displayName'),
          reaction_type_code = el.attr('code'),
          reaction_type_code_system = el.attr('codeSystem'),
          reaction_type_code_system_name = el.attr('codeSystemName');
      
      // reaction
      if (type == 'ccda') {
        el = entry.template('2.16.840.1.113883.10.20.22.4.9').tag('value');
      } else {
        el = entry.template('2.16.840.1.113883.10.20.1.54').tag('value');
      }
      var reaction_name = el.attr('displayName'),
          reaction_code = el.attr('code'),
          reaction_code_system = el.attr('codeSystem');
      
      // severity
      el = entry.template('2.16.840.1.113883.10.20.22.4.8').tag('value');
      var severity = el.attr('displayName');
      
      // participant => allergen
      el = entry.tag('participant').tag('code');
      var allergen_name = el.attr('displayName'),
          allergen_code = el.attr('code'),
          allergen_code_system = el.attr('codeSystem'),
          allergen_code_system_name = el.attr('codeSystemName');
      
      // status
      el = entry.template('2.16.840.1.113883.10.20.22.4.28').tag('value');
      var status = el.attr('displayName');
      
      data.push({
        date: {
          value: null,
          low: null,
          high: null
        },
        observation_date: { low: null },
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        status: status,
        severity: severity,
        reaction: {
          date: { low: null },
          name: reaction_name,
          code: reaction_code,
          code_system: reaction_code_system
        },
        reaction_type: {
          name: reaction_type_name,
          code: reaction_type_code,
          code_system: reaction_code_system,
          code_system_name: reaction_type_code_system_name
        },
        allergen: {
          name: allergen_name,
          code: allergen_code,
          code_system: allergen_code_system,
          code_system_name: allergen_code_system_name
        }
      });
    }
    return data;
  };
  
  return {
    process: process
  };

}();
