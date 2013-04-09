// vitals.js

var Vitals = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var entries, data = [];
    
    switch (type) {
      case 'ccda':
        entries = processCCDA(source);
        break;
      case 'va_c32':
        entries = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var entry = {
        date: e.date
      }
      
      var results = [];
      
      for (var j = 0; j < e.results.length; j++) {
        var r = e.results[j];
        results.push({
          name: r.name,
          code: r.code,
          code_system: r.code_system,
          code_system_name: r.code_system_name,
          value: r.value,
          unit: r.unit
        });
      }
      
      entry.results = results;
      data.push(entry);
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.4.1');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var entry_date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseInt(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          value: value,
          unit: unit
        });
      }
      
      data.push({
        date: entry_date,
        results: results_data
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.16');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseInt(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          value: value,
          unit: unit
        });
      }
      
      data.push({
        date: date,
        results: results_data
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
