// vitals.js

var Vitals = function () {
  
  // dependancies
  
  // properties
  var templateId = '';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      date: Core.date("19991114"),
      results: [
        {
          name: "Height",
          code: "8302-2",
          code_system: "2.16.840.1.113883.6.1",
          code_system_name: "LOINC",
          value: 117,
          unit: "cm"
        },
        {
          name: "Patient Body Weight - Measured",
          code: "3141-9",
          code_system: "2.16.840.1.113883.6.1",
          code_system_name: "LOINC",
          value: 86,
          unit: "kg"
        },
        {
          name: "Intravascular Systolic",
          code: "8480-6",
          code_system: "2.16.840.1.113883.6.1",
          code_system_name: "LOINC",
          value: 132,
          unit: "mm[Hg]"
        }
      ]
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
