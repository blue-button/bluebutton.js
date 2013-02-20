// encounters.js

var Encounters = function () {
  
  // dependancies
  
  // properties
  var templateId = '';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      date: Core.date("20000407"),
      name: "Office consultation - 15 minutes",
      finding: {
        name: "Bronchitis",
        code: "32398004",
        code_system: "2.16.840.1.113883.6.96"
      },
      code: "99241",
      code_system: "2.16.840.1.113883.6.12",
      code_system_name: "CPT",
      code_system_version: 4,
      translation: {
        name: "Ambulatory",
        code: "AMB",
        code_system: "2.16.840.1.113883.5.4",
        code_system_name: "HL7 ActEncounterCode"
      },
      performer: {
        name: "General Physician",
        code: "59058001",
        code_system: "2.16.840.1.113883.6.96",
        code_system_name: "SNOMED CT"
      },
      // location == participant
      location: {
        organization: "Good Health Clinic",
        street: ["17 Daws Rd."],
        city: "Blue Bell",
        state: "MA",
        zip: "02368",
        country: "US",
        name: "General Acute Care Hospital",
        code: "GACH",
        code_system: "2.16.840.1.113883.5.111",
        code_system_name: "HL7 RoleCode"
      }
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
