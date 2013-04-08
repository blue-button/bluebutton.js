// allergies.js

var Allergies = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date_range: {
          start: raw[i].start_date,
          end: raw[i].end_date
        },
        name: raw[i].name,
        code: raw[i].code,
        code_system: raw[i].code_system,
        code_system_name: raw[i].code_system_name,
        status: raw[i].status,
        severity: raw[i].severity,
        reaction: {
          name: raw[i].reaction_name,
          code: raw[i].reaction_code,
          code_system: raw[i].reaction_code_system
        },
        reaction_type: {
          name: raw[i].reaction_type_name,
          code: raw[i].reaction_type_code,
          code_system: raw[i].reaction_code_system,
          code_system_name: raw[i].reaction_type_code_system_name
        },
        allergen: {
          name: raw[i].allergen_name,
          code: raw[i].allergen_code,
          code_system: raw[i].allergen_code_system,
          code_system_name: raw[i].allergen_code_system_name
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.6.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
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
      el = entry.template('2.16.840.1.113883.10.20.22.4.9').tag('value');
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
        name: name,
        start_date: start_date,
        end_date: end_date,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        reaction_type_name: reaction_type_name,
        reaction_type_code: reaction_type_code,
        reaction_type_code_system: reaction_type_code_system,
        reaction_type_code_system_name: reaction_type_code_system_name,
        reaction_name: reaction_name,
        reaction_code: reaction_code,
        reaction_code_system: reaction_code_system,
        severity: severity,
        allergen_name: allergen_name,
        allergen_code: allergen_code,
        allergen_code_system: allergen_code_system,
        allergen_code_system_name: allergen_code_system_name
      });
    }
    
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.102');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = el.tag('low').attr('value'),
          end_date = el.tag('high').attr('value');
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('code');
      var name = el.tag('originalText').val(),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      // value => reaction_type
      el = entry.template('2.16.840.1.113883.10.20.1.54').tag('value');
      var reaction_type_name = el.attr('displayName'),
          reaction_type_code = el.attr('code'),
          reaction_type_code_system = el.attr('codeSystem'),
          reaction_type_code_system_name = el.attr('codeSystemName');
      
      // reaction
      el = entry.template('2.16.840.1.113883.10.20.1.54').tag('value');
      var reaction_name = el.attr('displayName'),
          reaction_code = el.attr('code'),
          reaction_code_system = el.attr('codeSystem');
      
      // severity
      el = entry.template('2.16.840.1.113883.10.20.1.55').tag('value');
      var severity = el.attr('displayName');
      
      // participant => allergen
      el = entry.tag('participant').tag('code');
      var allergen_name = entry.tag('participant').tag('name').val(),
          allergen_code = el.attr('code'),
          allergen_code_system = el.attr('codeSystem'),
          allergen_code_system_name = el.attr('codeSystemName');
      
      // status
      el = entry.template('2.16.840.1.113883.10.20.22.4.28').tag('value');
      var status = el.attr('displayName');
      
      data.push({
        name: name,
        start_date: start_date,
        end_date: end_date,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        reaction_type_name: reaction_type_name,
        reaction_type_code: reaction_type_code,
        reaction_type_code_system: reaction_type_code_system,
        reaction_type_code_system_name: reaction_type_code_system_name,
        reaction_name: reaction_name,
        reaction_code: reaction_code,
        reaction_code_system: reaction_code_system,
        severity: severity,
        allergen_name: allergen_name,
        allergen_code: allergen_code,
        allergen_code_system: allergen_code_system,
        allergen_code_system_name: allergen_code_system_name
      });
    }
    
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();
