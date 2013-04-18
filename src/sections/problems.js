// problems.js

var Problems = function () {
  
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
        status: raw[i].status,
        age: raw[i].age,
        code: raw[i].code,
        code_system: raw[i].code_system
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.5.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      var age = parseInt(el.tag('value').attr('value'));
      
      data.push({
        start_date: start_date,
        end_date: end_date,
        name: name,
        code: code,
        code_system: code_system,
        status: status,
        age: age
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.11');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('code');
      var name = el.tag('originalText').val(),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      var age = parseInt(el.tag('value').attr('value'));
      
      data.push({
        start_date: start_date,
        end_date: end_date,
        name: name,
        code: code,
        code_system: code_system,
        status: status,
        age: age
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
