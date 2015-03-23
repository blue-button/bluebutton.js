/*
 * Parser for the CCDA document section
 */

Parsers.CCDA.document = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var doc = ccda.section('document');

  var date = parseDate(doc.tag('effectiveTime').attr('value'));
  var title = Core.stripWhitespace(doc.tag('title').val());
  
  var author = doc.tag('author');
  el = author.tag('assignedPerson').tag('name');
  var name_dict = parseName(el);
  
  el = author.tag('addr');
  var address_dict = parseAddress(el);
  
  el = author.tag('telecom');
  var work_phone = el.attr('value');

  var documentation_of_list = [];
  var performers = doc.tag('documentationOf').elsByTag('performer');
  for (var i = 0; i < performers.length; i++) {
    el = performers[i];
    var performer_name_dict = parseName(el);
    var performer_phone = el.tag('telecom').attr('value');
    var performer_addr = parseAddress(el.tag('addr'));
    documentation_of_list.push({
      name: performer_name_dict,
      phone: {
        work: performer_phone
      },
      address: performer_addr
    });
  }

  el = doc.tag('encompassingEncounter').tag('location');
  var location_name = Core.stripWhitespace(el.tag('name').val());
  var location_addr_dict = parseAddress(el.tag('addr'));
  
  var encounter_date = null;
  el = el.tag('effectiveTime');
  if (!el.isEmpty()) {
    encounter_date = parseDate(el.attr('value'));
  }
  
  data = {
    date: date,
    title: title,
    author: {
      name: name_dict,
      address: address_dict,
      phone: {
        work: work_phone
      }
    },
    documentation_of: documentation_of_list,
    location: {
      name: location_name,
      address: location_addr_dict,
      encounter_date: encounter_date
    }
  };
  
  return data;
};
