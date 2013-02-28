// labs.js

var Labs = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var sectionTemplateID = '2.16.840.1.113883.10.20.22.2.3.1';
  
  // methods
  var process = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = el.attr('value'),
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
          reference: {
            low: reference_low,
            high: reference_high
          }
        });
      }
      
      data.push({
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        results: results_data
      });
    }
    return data;
  };
  
  return {
    process: process
  };

}();
