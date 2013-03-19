// problems.js

var Problems = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var CCDASectionTemplateID = '2.16.840.1.113883.10.20.22.2.5';
  var C32SectionTemplateID = '2.16.840.1.113883.10.20.1.11';
  
  // methods
  var process = function (xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    
    if (type == 'ccda') {
      templateID = CCDASectionTemplateID;
    } else {
      templateID = C32SectionTemplateID;
    }
    
    el = xmlDOM.template(templateID);
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var from = parseDate(el.tag('low').attr('value')),
          to = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      var age = parseInt(el.tag('value').attr('value'));
      
      data.push({
        date: {
          from: from,
          to: to
        },
        name: name,
        status: status,
        age: age,
        code: code,
        code_system: code_system
      });
    }
    return data;
  };
  
  return {
    process: process
  };

}();
