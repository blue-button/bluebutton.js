// encounters.js

var Encounters = function () {
  
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
        name: raw[i].name,
        code: raw[i].code,
        code_system: raw[i].code_system,
        code_system_name: raw[i].code_system_name,
        code_system_version: raw[i].code_system_version,
        finding: {
          name: raw[i].finding_name,
          code: raw[i].finding_code,
          code_system: raw[i].finding_code_system
        },
        translation: {
          name: raw[i].translation_name,
          code: raw[i].translation_code,
          code_system: raw[i].translation_code_system,
          code_system_name: raw[i].translation_code_system_name
        },
        performer: {
          name: raw[i].performer_name,
          code: raw[i].performer_code,
          code_system: raw[i].performer_code_system,
          code_system_name: raw[i].performer_code_system_name
        },
        location: {
          organization: raw[i].organization,
          street: raw[i].street,
          city: raw[i].city,
          state: raw[i].state,
          zip: raw[i].zip,
          country: raw[i].country
        }
      });
    }
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.22');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      var date = parseDate(entry.tag('effectiveTime').attr('value'));
      
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName'),
          code_system_version = el.attr('codeSystemVersion');
      
      // finding
      el = entry.tag('value');
      var finding_name = el.attr('displayName'),
          finding_code = el.attr('code'),
          finding_code_system = el.attr('codeSystem');
      
      // translation
      el = entry.tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // performer
      el = entry.tag('performer').tag('code');
      var performer_name = el.attr('displayName'),
          performer_code = el.attr('code'),
          performer_code_system = el.attr('codeSystem'),
          performer_code_system_name = el.attr('codeSystemName');

      // participant => location
      el = entry.tag('participant');
      var organization = el.tag('code').attr('displayName');
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
      
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        code_system_version: code_system_version,
        finding_name: finding_name,
        finding_code: finding_code,
        finding_code_system: finding_code_system,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        performer_name: performer_name,
        performer_code_system: performer_code_system,
        performer_code_system_name: performer_code_system_name,
        organization: organization,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
      });
    }
    
    return data;
  };
  
 var processVAC32 = function (xmlDOM) {
   var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.3');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      var date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
      
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName'),
          code_system_version = el.attr('codeSystemVersion');
      
      // finding
      el = entry.tag('value');
      var finding_name = el.attr('displayName'),
          finding_code = el.attr('code'),
          finding_code_system = el.attr('codeSystem');
      
      // translation
      el = entry.tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // performer
      el = entry.tag('performer').tag('code');
      var performer_name = el.attr('displayName'),
          performer_code = el.attr('code'),
          performer_code_system = el.attr('codeSystem'),
          performer_code_system_name = el.attr('codeSystemName');

      // participant => location
      el = entry.tag('participant');
      var organization = el.tag('code').attr('displayName');
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
      
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        code_system_version: code_system_version,
        finding_name: finding_name,
        finding_code: finding_code,
        finding_code_system: finding_code_system,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        performer_name: performer_name,
        performer_code_system: performer_code_system,
        performer_code_system_name: performer_code_system_name,
        organization: organization,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
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
