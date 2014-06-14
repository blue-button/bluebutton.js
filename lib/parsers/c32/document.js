/*
 * Parser for the C32 document section
 */

Parsers.C32.document = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var doc = c32.section('document');

  var date = parseDate(doc.tag('effectiveTime').attr('value'));
  
  var author = doc.tag('author');
  el = author.tag('assignedPerson').tag('name');
  var name_dict = parseName(el);
  // Sometimes C32s include names that are just like <name>String</name>
  // and we still want to get something out in that case
  if (!name_dict.prefix && !name_dict.given.length && !name_dict.family) {
   name_dict.family = el.val();
  }
  
  el = author.tag('addr');
  var address_dict = parseAddress(el);
  
  el = author.tag('telecom');
  var work_phone = el.attr('value');

  var documentation_of_list = [];
  var performers = doc.tag('documentationOf').elsByTag('performer');
  for (var i = 0; i < performers.length; i++) {
    el = performers[i].tag('assignedPerson').tag('name');
    var performer_name_dict = parseName(el);
    var performer_phone = performers[i].tag('telecom').attr('value');
    var performer_addr = parseAddress(el.tag('addr'));
    documentation_of_list.push({
      name: performer_name_dict,
      phone: {
        work: performer_phone
      },
      address: performer_addr
    });
  }

  el = doc.tag('encompassingEncounter');
  var location_name = Core.stripWhitespace(el.tag('name').val());
  var location_addr_dict = parseAddress(el.tag('addr'));
  
  var encounter_date = null;
  el = el.tag('effectiveTime');
  if (!el.isEmpty()) {
    encounter_date = parseDate(el.attr('value'));
  }
  
  data = {
    date: date,
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
