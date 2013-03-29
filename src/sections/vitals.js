// vitals.js

var Vitals = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var CCDASectionTemplateID = '2.16.840.1.113883.10.20.22.2.4.1';
  var C32SectionTemplateID = '2.16.840.1.113883.10.20.1.16';
  
  // methods
  var process = function (xmlDOM, type) {
    var data = [], results_data = [], el, entries, entry, results, result, templateID;
    
    if (type == 'ccda') {
      templateID = CCDASectionTemplateID;
    } else {
      templateID = C32SectionTemplateID;
    }
    
    el = xmlDOM.template(templateID);
    
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
        var value = el.attr('value'),
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
  
  return {
    process: process
  };

}();
