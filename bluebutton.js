// bluebutton.js

(function() {
  
  ///////////////////////
  // Static functionality
  var Core = function() {
    
    var convert = function (xml) {
      return xml + ' converted';
    };
    
    return {
      convert: convert
    }
  }();
  
  
  var Labs = function () {
    
    var labs = function (args) {
      return this.getData() + ' labs:' + args;
    };
    
    var ranges = function () {
    };
    
    return {
      a: labs,
      b: ranges
    };
  
  }();
  
  ////////////////////////////////////////
  // BlueButton and instance stuff created
  var BB = function (xml) {
    // dependancies
    var c = Labs.a,
        d = Labs.b;
    
    // properties
    var data = null;
    
    var getData = function () {
      return data;
    };
    
    // init
    data = Core.convert(xml);
    
    return {
      labs: c,
      labRanges: d,
      getData: getData
      // Meds.meds: meds,
      // Meds.types: medTypes
    };
  };
  
  
  window.BlueButton = BB;
  
})();


// var bb = BlueButton('bb');
// 
// bb.labs('hello');
// 
// bb.getData();
//
// Should return:
//   "bb converted"


// var bb2 = BlueButton('bb2');
//
// bb2.labs('goodbye');
//
// bb2.getData();
//
// Should return:
//   "bb2 converted"















