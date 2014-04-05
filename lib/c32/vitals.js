/*
 * vitals.js
 */

C32.Vitals = function () {
  
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
   * Parse the vitals CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], results_data, el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.119');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var entry_date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      results_data = [];
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseFloat(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          // code_system: code_system,
          // code_system_name: code_system_name,
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
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
}();
