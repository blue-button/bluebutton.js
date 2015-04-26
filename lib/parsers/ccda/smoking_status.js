/*
 * Parser for the CCDA smoking status in social history section
 */

Parsers.CCDA.smoking_status = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data, el;

  var name = null,
      code = null,
      code_system = null,
      code_system_name = null,
      entry_date = null;

  // We can parse all of the social_history sections,
  // but in practice, this section seems to be used for
  // smoking status, so we're just going to break that out.
  // And we're just looking for the first non-empty one.
  var social_history = ccda.section('social_history');
  var entries = social_history.entries();
  for (var i=0; i < entries.length; i++) {
    var entry = entries[i];

    var smoking_status = entry.template('2.16.840.1.113883.10.20.22.4.78');
    if (smoking_status.isEmpty()) {
      smoking_status = entry.template('2.16.840.1.113883.10.22.4.78');
    }
    if (smoking_status.isEmpty()) {
      continue;
    }

    el = smoking_status.tag('effectiveTime');
    entry_date = parseDate(el.attr('value'));

    el = smoking_status.tag('value');
    name = el.attr('displayName');
    code = el.attr('code');
    code_system = el.attr('codeSystem');
    code_system_name = el.attr('codeSystemName');

    if (name) {
      break;
    }
  }

  data = {
    date: entry_date,
    name: name,
    code: code,
    code_system: code_system,
    code_system_name: code_system_name
  };
  
  return data;
};
