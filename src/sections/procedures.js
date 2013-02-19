// procedures.js

var Procedures = function () {
  
  // dependancies
  
  // properties
  var templateId = '2.16.840.1.113883.10.20.22.2.7';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      date: "20110215",
      name: "Colonic polypectomy",
      code: "274025005",
      code_system: "2.16.840.1.113883.6.96",
      specimen: {
        name: "colonic polyp sample",
        code: "309226005",
        code_system: "2.16.840.1.113883.6.96"
      },
      performer: {
        organization: "Good Health Clinic",
        street: ["17 Daws Rd."],
        city: "Blue Bell",
        state: "MA",
        zip: "02368",
        country: "US",
        phone: "555-555-1234"
      },
      // device == participant
      participant: {
        name: "Colonoscope",
        code: "90412006",
        code_system: "2.16.840.1.113883.6.96"    
      }
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
