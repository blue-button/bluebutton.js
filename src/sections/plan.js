// plan.js

var Plan = function () {
  
  // dependancies
  
  // properties
  var templateId = '';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      date: Core.date("20000421"),
      name: "Colonoscopy",
      code: "310634005",
      code_system: "2.16.840.1.113883.6.96"
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
