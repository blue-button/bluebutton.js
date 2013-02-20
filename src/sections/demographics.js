// demographics.js

var Demographics = function () {
  
  // dependancies
  
  // properties
  var templateId = '';
  
  // methods
  var process = function (xmlDOM) {
    var data = {
      name: {
        prefix: "Mr.",
        given: ["Adam", "Frankie"],
        family: "Everyman"
      },
      dob: Core.date("19541125"),
      gender: "male",
      // Marital status uses code system 2.16.840.1.113883.5.2
      // TODO: document all possible marital_status values
      marital_status: "married",
      address: {
       street: ["17 Daws Rd.", "Apt 102"],
        city: "Blue Bell",
        state: "MA",
        country: "US",
        zip: "02368"
      },
      phone: {
        home: ["555-555-1212"],
        work: ["555-555-2323"],
        mobile: ["555-555-3434", "555-555-4545"]
      },
      email: "adam@email.com",
      race: "white",
      ethnicity: "Not Hispanic or Latino",
      religion: "Christian (non-Catholic, non-specific)",
      guardian: {
        name: {
          given: ["Ralph", "Frankie"],
          family: "Relative"
        },
        // TODO: document all possible relationship values[e]
        relationship: "Grandfather",
        address: {
          street: ["17 Daws Rd.", "Apt 102"],
          city: "Blue Bell",
          state: "MA",
          country: "US",
          zip: "02368"
        },
        phone: {
          home: ["781-555-1212"]
        }
      },
      birthplace: {
        state: "MA",
        zip: "02368",
        country: "US"
      },
      provider: {
        organization: "Good Health Clinic",
        phone: "781-555-1212",
        address: {
          street: ["21 North Ave"],
          city: "Burlington",
          state: "MA",
          zip: "02368",
          country: "US"
        }
      }
    };
    
    return data;
  };
  
  return {
    process: process
  };

}();
