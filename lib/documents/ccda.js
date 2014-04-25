/*
 * ...
 */

Documents.CCDA = (function () {
  
  /*
   * Preprocesses the CCDA document
   */
  var preprocess = function (ccda) {
    ccda.section = section;
    return ccda;
  };
  
  
  /*
   * Finds the section of a CCDA document
   */
  var section = function (name) {
    var el;
    
    switch (name) {
      case 'allergies':
        el = this.template('2.16.840.1.113883.10.20.22.2.6.1');
        el.entries = entries;
        return el;
      case 'demographics':
        el = this.template('2.16.840.1.113883.10.20.22.1.1');
        el.entries = entries;
        return el;
      case 'encounters':
        el = this.template('2.16.840.1.113883.10.20.22.2.22');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.22.1');
          el.entries = entries;
          return el;
        } else {
          el.entries = entries;
          return el;
        }
        break;
      case 'immunizations':
        el = this.template('2.16.840.1.113883.10.20.22.2.2.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.2');
          el.entries = entries;
          return el;
        } else {
          el.entries = entries;
          return el;
        }
        break;
      case 'labs':
        el = this.template('2.16.840.1.113883.10.20.22.2.3.1');
        el.entries = entries;
        return el;
      case 'medications':
        el = this.template('2.16.840.1.113883.10.20.22.2.1.1');
        el.entries = entries;
        return el;
      case 'problems':
        el = this.template('2.16.840.1.113883.10.20.22.2.5.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.5');
          el.entries = entries;
          return el;
        } else {
          el.entries = entries;
          return el;
        }
        break;
      case 'procedures':
        el = this.template('2.16.840.1.113883.10.20.22.2.7.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.7');
        } else {
          el.entries = entries;
          return el;
        }
        break;
      case 'vitals':
        el = this.template('2.16.840.1.113883.10.20.22.2.4.1');
        el.entries = entries;
        return el;
    }
    
    return null;
  };
  
  
  /*
   * Parses an HL7 date in String form and creates a new Date object.
   * 
   * TODO: CCDA dates can be in form:
   *   <effectiveTime value="20130703094812"/>
   * ...or:
   *   <effectiveTime>
   *     <low value="19630617120000"/>
   *     <high value="20110207100000"/>
   *   </effectiveTime>
   * When latter, parseDate will not be given type `String`, but `null` and
   * log the error "date is not a string".
   */
  var parseDate = function (str) {
    if (!str || typeof str !== "string") {
      // console.log("Error: date is not a string");
      return null;
    }
    var year = str.substr(0, 4);
    // months start at 0, because why not
    var month = parseInt(str.substr(4, 2), 10) - 1;
    var day = str.substr(6, 2);
    return new Date(year, month, day);
  };
  
  
  return {
    section: section,
    parseDate: parseDate
  };
  
})();
