/*
 * allergies.js
 */

CCDA.Allergies = function () {
  
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
   * Parse the allergies CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.6.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      // value => reaction_type
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('value');
      var reaction_type_name = el.attr('displayName'),
          reaction_type_code = el.attr('code'),
          reaction_type_code_system = el.attr('codeSystem'),
          reaction_type_code_system_name = el.attr('codeSystemName');
      
      // reaction
      el = entry.template('2.16.840.1.113883.10.20.22.4.9').tag('value');
      var reaction_name = el.attr('displayName'),
          reaction_code = el.attr('code'),
          reaction_code_system = el.attr('codeSystem');
      
      // severity
      el = entry.template('2.16.840.1.113883.10.20.22.4.8').tag('value');
      var severity = el.attr('displayName');
      
      // participant => allergen
      el = entry.tag('participant').tag('code');
      var allergen_name = el.attr('displayName'),
          allergen_code = el.attr('code'),
          allergen_code_system = el.attr('codeSystem'),
          allergen_code_system_name = el.attr('codeSystemName');
      
      // status
      el = entry.template('2.16.840.1.113883.10.20.22.4.28').tag('value');
      var status = el.attr('displayName');
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        status: status,
        severity: severity,
        reaction: {
          name: reaction_name,
          code: reaction_code,
          code_system: reaction_code_system
        },
        reaction_type: {
          name: reaction_type_name,
          code: reaction_type_code,
          code_system: reaction_type_code_system,
          code_system_name: reaction_type_code_system_name
        },
        allergen: {
          name: allergen_name,
          code: allergen_code,
          code_system: allergen_code_system,
          code_system_name: allergen_code_system_name
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
