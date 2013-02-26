// problems.js

var Problems = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var sectionTemplateID = '2.16.840.1.113883.10.20.22.2.5';
  
  // methods
  var process = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var from = el.tag('low').attr('value'),
          to = el.tag('high').attr('value');
      
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
