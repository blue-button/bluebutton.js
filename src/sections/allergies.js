// allergies.js

var Allergies = function () {
  
  // dependancies
  
  // properties
  var templateId = '';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      date: {
        value: "20090909",
        low: "20090902",
        high: "20100103"
      },
      observation: {
        date: { low: "20110215" },
        name: "drug allergy",
        code: "416098002",
        code_system: "2.16.840.1.113883.6.96",
        code_system_name: "SNOMED CT",
        value: {
          name: "Adverse reaction to substance",
          code: "282100009",
          code_system: "2.16.840.1.113883.6.96",
          code_system_name: "SNOMED CT"
        },
        participant: {
          name: "ALLERGENIC EXTRACT, PENICILLIN",
          code: "314422",
          code_system: "2.16.840.1.113883.6.88",
          code_system_name: "RxNorm"
        },
        status: "active",
        reaction: {
          date: { low: "20090711" },
          name: "Hives",
          code: "247472004",
          code_system: "2.16.840.1.113883.6.96"
        },
        severity: "moderate to severe"
      }
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
