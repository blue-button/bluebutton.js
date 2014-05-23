/*
 * Parser for any freetext section (i.e., contains just a single <text> element)
 */

Parsers.CCDA.free_text = function (ccda, sectionName) {

  var data = {};
  
  var doc = ccda.section(sectionName);
  var text = Core.stripWhitespace(doc.tag('text').val());
  
  data = {
    text: text
  };

  return data;
};
