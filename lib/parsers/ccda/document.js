/*
 * Parser for the CCDA document section
 */

Parsers.ccda.document = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var doc = ccda.section('document');
  
  var author = doc.tag('author');
  el = author.tag('assignedPerson').tag('name');
  var name_dict = parseName(el);
  
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
