// labs.js - Laboratory Results

var Labs = function () {
  
  // dependancies
  
  // properties
  var templateId = "2.16.840.1.113883.10.20.22.2.3.1";
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      name: "CBC WO DIFFERENTIAL",
      code: "43789009",
      code_system: "2.16.840.1.113883.6.96",
      code_system_name: "SNOMED CT",
      results: [
        {
          date: "200003231430",
          name: "WBC",
          value: 6.7,
          unit: "10+3/ul",
          code: "33765-9",
          code_system: "2.16.840.1.113883.6.1",
          code_system_name: "LOINC",
          range: {
            low: 4.3,
            high: 10.8
          }
        }
      ]
    });
    return data;
  };
  
  return {
    process: process
  };

}();





