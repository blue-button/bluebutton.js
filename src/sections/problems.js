// problems.js

var Problems = function () {
  
  // dependancies
  
  // properties
  var templateId = '2.16.840.1.113883.10.20.22.2.5';
  
  // methods
  var process = function (xmlDOM) {
    var data = [];
    data.push({
      date: {
        from: "199803",
        to: "199803"
      },
      name: "Pneumonia",
      status: "Active",
      age: 57,
      code: "233604007",
      code_system: "2.16.840.1.113883.6.96"
    });
    
    return data;
  };
  
  return {
    process: process
  };

}();
