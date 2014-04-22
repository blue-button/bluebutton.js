/*
 * problems.js
 */

C32.Problems = function () {
  
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
   * Parse the problems CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.103');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('value');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');

      // Pre-C32 CCDs put the problem name in this "originalText" field, and some vendors
      // continue doing this with their C32, even though it's not technically correct
      if (!name) {
        el = entry.template('2.16.840.1.113883.10.20.1.28').tag('originalText');
        name = el.val();
      }

      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      el = entry.template('2.16.840.1.113883.10.20.1.50');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.1.38');
      var age = parseFloat(el.tag('value').attr('value'));
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        status: status,
        age: age,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        }
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
