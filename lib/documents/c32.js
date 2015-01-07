/*
 * ...
 */

Documents.C32 = (function () {
  
  /*
   * Preprocesses the C32 document
   */
  var process = function (c32) {
    c32.section = section;
    return c32;
  };
  
  
  /*
   * Finds the section of a C32 document
   *
   * Usually we check first for the HITSP section ID and then for the HL7-CCD ID.
   */
  var section = function (name) {
    var el, entries = Documents.entries;
    
    switch (name) {
      case 'document':
        return this.template('2.16.840.1.113883.3.88.11.32.1');
      case 'allergies':
        el = this.template('2.16.840.1.113883.3.88.11.83.102');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.2');
        }
        el.entries = entries;
        return el;
      case 'demographics':
        return this.template('2.16.840.1.113883.3.88.11.32.1');
      case 'encounters':
        el = this.template('2.16.840.1.113883.3.88.11.83.127');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.3');
        }
        el.entries = entries;
        return el;
      case 'immunizations':
        el = this.template('2.16.840.1.113883.3.88.11.83.117');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.6');
        }
        el.entries = entries;
        return el;
      case 'results':
        el = this.template('2.16.840.1.113883.3.88.11.83.122');
        el.entries = entries;
        return el;
      case 'medications':
        el = this.template('2.16.840.1.113883.3.88.11.83.112');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.8');
        }
        el.entries = entries;
        return el;
      case 'problems':
        el = this.template('2.16.840.1.113883.3.88.11.83.103');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.11');
        }
        el.entries = entries;
        return el;
      case 'procedures':
        el = this.template('2.16.840.1.113883.3.88.11.83.108');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.12');
        }
        el.entries = entries;
        return el;
      case 'vitals':
        el = this.template('2.16.840.1.113883.3.88.11.83.119');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.16');
        }
        el.entries = entries;
        return el;
    }
    
    return null;
  };
  
  
  return {
    process: process,
    section: section
  };
  
})();
