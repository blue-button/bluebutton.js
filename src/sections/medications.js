// medications.js

var Medications = function () {
  
  // dependancies
  
  // properties
  var templateId = '2.16.840.1.113883.10.20.22.2.1.1';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      effective_time: {
        low: "20110301",
        high: "20120301"
      },
      product: {
        name: "Albuterol 0.09 MG/ACTUAT inhalant solution",
        code: "329498",
        code_system: "2.16.840.1.113883.6.88",
        translation: {
          name: "Proventil 0.09 MG/ACTUAT inhalant solution",
          code: "573621",
          code_system: "2.16.840.1.113883.6.88",
          code_system_name: "RxNorm"
        }
      },
      dose_quantity: 1,
      rate_quantity: {
        value: 90,
        unit: "ml/min"
      },
      precondition: {
        name: "Wheezing",
        code: "56018004",
        code_system: "2.16.840.1.113883.6.96"
      },
      reason: {
        name: "Bronchitis",
        code: "32398004",
        code_system: "2.16.840.1.113883.6.96"
      },
      route: {
        name: "RESPIRATORY (INHALATION)",
        code: "C38216",
        code_system: "2.16.840.1.113883.3.26.1.1",
        code_system_name: "NCI Thesaurus"
      },
      participant: {
        name: "drug vehicle",
        code: "412307009",
        code_system: "2.16.840.1.113883.6.96",
        playing_entity: {
          name: "Diethylene Glycol",
          code: "5955009",
          code_system: "2.16.840.1.113883.6.96",
          code_system_name: "SNOMED CT"
        }
      },
      administration: {
        name: "INHALANT",
        code: "C42944",
        code_system: "2.16.840.1.113883.3.26.1.1",
        code_system_name: "NCI Thesaurus"
      },
      performer: {
        organization: "Good Health Clinic",
        person: "Dr. Robert Michaels"
      }
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
