// labs.js

var Labs = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var panels, data = [];
    
    switch (type) {
      case 'ccda':
        panels = processCCDA(source);
        break;
      case 'va_c32':
        panels = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i];
      var panel = {
        name: p.name,
        code: p.code,
        code_system: p.code_system,
        code_system_name: p.code_system_name
      }
      
      var results = [];
      
      for (var j = 0; j < p.results.length; j++) {
        var r = p.results[j];
        results.push({
          date: r.date,
          name: r.name,
          value: r.value,
          unit: r.unit,
          code: r.code,
          code_system: r.code_system,
          code_system_name: r.code_system_name,
          reference: {
            low: r.reference_low,
            high: r.reference_high
          }
        });
      }
      
      panel.results = results;
      data.push(panel);
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.3.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          panel_code_system = el.attr('codeSystem'),
          panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseInt(el.attr('value')),
            unit = el.attr('unit');
        
        // reference range may not be present
        reference_low = null;
        reference_high = null;
        
        results_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          reference_low: reference_low,
          reference_high: reference_high
        });
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        code_system: panel_code_system,
        code_system_name: panel_code_system_name,
        results: results_data
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.14');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          panel_code_system = el.attr('codeSystem'),
          panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.tag('originalText').val(),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseInt(el.attr('value')),
            unit = el.attr('unit');
        
        // reference range may not be present
        reference_low = null;
        reference_high = null;
        
        results_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          reference_low: reference_low,
          reference_high: reference_high
        });
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        code_system: panel_code_system,
        code_system_name: panel_code_system_name,
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
