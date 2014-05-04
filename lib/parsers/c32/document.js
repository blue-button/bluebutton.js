/*
 * Parser for the C32 document section
 */

Parsers.C32.document = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var doc = c32.section('document');
  
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
  
  data = {
    author: {
      name: name_dict,
      address: address_dict,
      phone: {
        work: work_phone
      }
    }
  };
  
  return data;
};
