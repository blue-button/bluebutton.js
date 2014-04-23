/*
 * codes.js
 */

/* exported Codes */
var Codes = (function () {
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  /*
   * Administrative Gender (HL7 V3)
   * http://phinvads.cdc.gov/vads/ViewValueSet.action?id=8DE75E17-176B-DE11-9B52-0015173D1785
   * OID: 2.16.840.1.113883.1.11.1
   */
  var gender = function (code) {
    var map = {
      'F': 'female',
      'M': 'male',
      'UN': 'undifferentiated'
    };
    
    return map[code] || null;
  };
  
  /*
   * Marital Status (HL7)
   * http://phinvads.cdc.gov/vads/ViewValueSet.action?id=46D34BBC-617F-DD11-B38D-00188B398520
   * OID: 2.16.840.1.114222.4.11.809
   */
  var maritalStatus = function (code) {
    var map = {
      'N': 'annulled',
      'C': 'common law',
      'D': 'divorced',
      'P': 'domestic partner',
      'I': 'interlocutory',
      'E': 'legally separated',
      'G': 'living together',
      'M': 'married',
      'O': 'other',
      'R': 'registered domestic partner',
      'A': 'separated',
      'S': 'single',
      'U': 'unknown',
      'B': 'unmarried',
      'T': 'unreported',
      'W': 'widowed'
    };
    
    return map[code] || null;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    gender: gender,
    maritalStatus: maritalStatus
  };
  
})();
