// procedures.js

var Procedures = function () {
  
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
        specimen: {
          name: raw[i].specimen_name,
          code: raw[i].specimen_code,
          code_system: raw[i].specimen_code_system
        },
        performer: {
          organization: raw[i].organization,
          street: raw[i].street,
          city: raw[i].city,
          state: raw[i].state,
          zip: raw[i].zip,
          country: raw[i].country,
          phone: raw[i].phone
        },
        device: {
          name: raw[i].device_name,
          code: raw[i].device_code,
          code_system: raw[i].device_code_system
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.7.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      // 'specimen' tag not always present
      // el = entry.tag('specimen').tag('code');
      // var specimen_name = el.attr('displayName'),
      //     specimen_code = el.attr('code'),
      //     specimen_code_system = el.attr('codeSystem');
      var specimen_name = null,
          specimen_code = null,
          specimen_code_system = null;
      
      el = entry.tag('performer').tag('addr');
      var organization = el.tag('name').val(),
          phone = el.tag('telecom').attr('value');
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
          
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      // participant => device
      el = entry.tag('participant').tag('code');
      var device_name = el.attr('displayName'),
          device_code = el.attr('code'),
          device_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        specimen_name: specimen_name,
        specimen_code: specimen_code,
        specimen_code_system: specimen_code_system,
        organization: organization,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country,
        device_name: device_name,
        device_code: device_code,
        device_code_system: device_code_system
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.12');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.tag('low').attr('value'));
      
      el = entry.tag('code');
      var name = el.tag('originalText').val(),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      // 'specimen' tag not always present
      // el = entry.tag('specimen').tag('code');
      // var specimen_name = el.attr('displayName'),
      //     specimen_code = el.attr('code'),
      //     specimen_code_system = el.attr('codeSystem');
      var specimen_name = null,
          specimen_code = null,
          specimen_code_system = null;
      
      el = entry.tag('performer').tag('addr');
      var organization = el.tag('name').val(),
          phone = el.tag('telecom').attr('value');
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
          
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      // participant => device
      el = entry.tag('participant').tag('code');
      var device_name = el.attr('displayName'),
          device_code = el.attr('code'),
          device_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        specimen_name: specimen_name,
        specimen_code: specimen_code,
        specimen_code_system: specimen_code_system,
        organization: organization,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country,
        device_name: device_name,
        device_code: device_code,
        device_code_system: device_code_system
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
