// plan.js

var Plan = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var sectionTemplateID = '2.16.840.1.113883.10.20.22.2.10';
  
  // methods
  var process = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      var date = null,
          name = null,
          code = null,
          code_system = null;
      
      data.push({
        date: date,
        name: name,
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
