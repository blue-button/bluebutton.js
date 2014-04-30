/*
 * ...
 */

Documents.CCDA = (function () {
  
  /*
   * Preprocesses the CCDA document
   */
  var process = function (ccda) {
    ccda.section = section;
    return ccda;
  };
  
  
  /*
   * Finds the section of a CCDA document
   */
  var section = function (name) {
    var el, entries = Documents.entries;
    
    switch (name) {
      case 'document':
        return this.template('2.16.840.1.113883.10.20.22.1.1');
      case 'allergies':
        el = this.template('2.16.840.1.113883.10.20.22.2.6.1');
        el.entries = entries;
        return el;
      case 'demographics':
        return this.template('2.16.840.1.113883.10.20.22.1.1');
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
          el.entries = entries;
          return el;
        } else {
          el.entries = entries;
          return el;
        }
        break;
      case 'vitals':
        el = this.template('2.16.840.1.113883.10.20.22.2.4.1');
        el.entries = entries;
        return el;
      case 'social_history':
        el = this.template('2.16.840.1.113883.10.20.22.2.17');
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
