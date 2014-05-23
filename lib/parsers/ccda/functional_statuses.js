/*
 * Parser for the CCDA functional & cognitive status
 */

Parsers.CCDA.functional_statuses = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var data = [], el;

  var statuses = ccda.section('functional_statuses');

  statuses.entries().each(function(entry) {

    var date = parseDate(entry.tag('effectiveTime').attr('value'));
    if (!date) {
      date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
    }

    el = entry.tag('value');

    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');

    data.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name
    });
  
  });
  
  return data;
};
