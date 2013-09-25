/*
 * labs.js
 */

C32.Labs = function () {
  
  // Dependancies
  ///////////////////////////
  var parseDate = Core.parseDate;
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
  /*
   * Parse the labs CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], results_data, el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.122');

    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          // panel_code_system = el.attr('codeSystem'),
          // panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      results_data = [];
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            // code_system = el.attr('codeSystem'),
            // code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseFloat(el.attr('value')),
            unit = el.attr('unit');
        
        // reference range may not be present
        // reference_low = null;
        // reference_high = null;
        
        results_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          // code_system: code_system,
          // code_system_name: code_system_name,
          // reference_low: reference_low,
          // reference_high: reference_high
        });
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        // code_system: panel_code_system,
        // code_system_name: panel_code_system_name,
        results: results_data
      });
    }
    
    return data;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
}();
