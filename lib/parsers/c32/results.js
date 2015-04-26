/*
 * Parser for the C32 results (labs) section
 */

Parsers.C32.results = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var results = c32.section('results');
  
  results.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var panel_date = parseDate(entry.tag('effectiveTime').attr('value'));
    if (!panel_date) {
      panel_date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
    }
    
    // panel
    el = entry.tag('code');
    var panel_name = el.attr('displayName'),
        panel_code = el.attr('code'),
        panel_code_system = el.attr('codeSystem'),
        panel_code_system_name = el.attr('codeSystemName');
    
    var observation;
    var tests = entry.elsByTag('observation');
    var tests_data = [];
    
    for (var i = 0; i < tests.length; i++) {
      observation = tests[i];
      
      // sometimes results organizers contain non-results. we only want tests
      if (observation.template('2.16.840.1.113883.10.20.1.31').val()) {
        var date = parseDate(observation.tag('effectiveTime').attr('value'));
        
        el = observation.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');

        if (!name) {
          name = Core.stripWhitespace(observation.tag('text').val());
        }
    
        el = observation.tag('translation');
        var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
        el = observation.tag('value');
        var value = el.attr('value'),
            unit = el.attr('unit');
        // We could look for xsi:type="PQ" (physical quantity) but it seems better
        // not to trust that that field has been used correctly...
        if (value && !isNaN(parseFloat(value))) {
          value = parseFloat(value);
        }
        if (!value) {
          value = el.val(); // look for free-text values
        }
    
        el = observation.tag('referenceRange');
        var reference_range_text = Core.stripWhitespace(el.tag('observationRange').tag('text').val()),
            reference_range_low_unit = el.tag('observationRange').tag('low').attr('unit'),
            reference_range_low_value = el.tag('observationRange').tag('low').attr('value'),
            reference_range_high_unit = el.tag('observationRange').tag('high').attr('unit'),
            reference_range_high_value = el.tag('observationRange').tag('high').attr('value');
        
        tests_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          translation: {
            name: translation_name,
            code: translation_code,
            code_system: translation_code_system,
            code_system_name: translation_code_system_name
          },
          reference_range: {
            text: reference_range_text,
            low_unit: reference_range_low_unit,
            low_value: reference_range_low_value,
            high_unit: reference_range_high_unit,
            high_value: reference_range_high_value,
          }
        });
      }
    }
    
    data.push({
      name: panel_name,
      code: panel_code,
      code_system: panel_code_system,
      code_system_name: panel_code_system_name,
      date: panel_date,
      tests: tests_data
    });
  });
  
  return data;
};
