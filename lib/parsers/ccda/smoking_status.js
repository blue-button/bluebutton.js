/*
 * Parser for the CCDA smoking status in social history section
 */

Parsers.CCDA.smoking_status = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data, el;

  var social_history = ccda.section('social_history');

  // We can parse all of the social_history sections,
  // but in practice, this section seems to be used for
  // smoking status, so we're just going to break that out.
  var entry = social_history.template('2.16.840.1.113883.10.20.22.4.78');
  if (entry.isEmpty()) {
    entry = social_history.template('2.16.840.1.113883.10.22.4.78');
  }

  el = entry.tag('effectiveTime');
  var entry_date = parseDate(el.attr('value'));

  el = entry.tag('value');
  var name = el.attr('displayName'),
      code = el.attr('code'),
      code_system = el.attr('codeSystem'),
      code_system_name = el.attr('codeSystemName');

  data = {
    date: entry_date,
    name: name,
    code: code,
    code_system: code_system,
    code_system_name: code_system_name
  };
  
  return data;
};
