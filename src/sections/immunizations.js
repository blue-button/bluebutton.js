// immunizations.js

var Immunizations = function () {
  
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
        date: raw[i].date,
        product: {
          name: raw[i].product_name,
          code: raw[i].product_code,
          code_system: raw[i].product_code_system,
          code_system_name: raw[i].product_code_system_name,
          translation: {
            name: raw[i].translation_name,
            code: raw[i].translation_code,
            code_system: raw[i].translation_code_system,
            code_system_name: raw[i].translation_code_system_name
          }
        },
        route: {
          name: raw[i].route_name,
          code: raw[i].route_code,
          code_system: raw[i].route_code_system,
          code_system_name: raw[i].route_code_system_name
        },
        instructions: raw[i].instructions_text,
        education_type: {
          name: raw[i].education_name,
          code: raw[i].education_code,
          code_system: raw[i].education_code_system
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.2.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // date
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      // product
      el = entry.template('2.16.840.1.113883.10.20.22.4.54').tag('code');
      var product_name = el.attr('displayName'),
          product_code = el.attr('code'),
          product_code_system = el.attr('codeSystem'),
          product_code_system_name = el.attr('codeSystemName');
      
      // translation
      el = entry.template('2.16.840.1.113883.10.20.22.4.54').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // route
      el = entry.tag('routeCode');
      var route_name = el.attr('displayName'),
          route_code = el.attr('code'),
          route_code_system = el.attr('codeSystem'),
          route_code_system_name = el.attr('codeSystemName');
      
      // instructions
      el = entry.template('2.16.840.1.113883.10.20.22.4.20');
      var instructions_text = el.tag('text').val();
      el = el.tag('code');
      var education_name = el.attr('displayName'),
          education_code = el.attr('code'),
          education_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        product_name: product_name,
        product_code: product_code,
        product_code_system: product_code_system,
        product_code_system_name: product_code_system_name,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        route_name: route_name,
        route_code: route_code,
        route_code_system: route_code_system,
        route_code_system_name: route_code_system_name,
        instructions_text: instructions_text,
        education_name: education_name,
        education_code: education_code,
        education_code_system: education_code_system
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.6');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // date
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      // product
      el = entry.template('2.16.840.1.113883.10.20.1.53').tag('code');
      var product_name = el.attr('displayName'),
          product_code = el.attr('code'),
          product_code_system = el.attr('codeSystem'),
          product_code_system_name = el.attr('codeSystemName');
      
      // translation
      el = entry.template('2.16.840.1.113883.10.20.22.4.54').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // route
      el = entry.tag('routeCode');
      var route_name = el.attr('displayName'),
          route_code = el.attr('code'),
          route_code_system = el.attr('codeSystem'),
          route_code_system_name = el.attr('codeSystemName');
      
      // instructions
      el = entry.template('2.16.840.1.113883.10.20.22.4.20');
      var instructions_text = el.tag('text').val();
      el = el.tag('code');
      var education_name = el.attr('displayName'),
          education_code = el.attr('code'),
          education_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        product_name: product_name,
        product_code: product_code,
        product_code_system: product_code_system,
        product_code_system_name: product_code_system_name,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        route_name: route_name,
        route_code: route_code,
        route_code_system: route_code_system,
        route_code_system_name: route_code_system_name,
        instructions_text: instructions_text,
        education_name: education_name,
        education_code: education_code,
        education_code_system: education_code_system
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
