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
      case 'care_plan':
        el = this.template('2.16.840.1.113883.10.20.22.2.10');
        el.entries = entries;
        return el;
      case 'chief_complaint':
        el = this.template('2.16.840.1.113883.10.20.22.2.13');
        if (el.isEmpty()) {
          el = this.template('1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1');
        }
        // no entries in Chief Complaint
        return el;
      case 'demographics':
        return this.template('2.16.840.1.113883.10.20.22.1.1');
      case 'encounters':
        el = this.template('2.16.840.1.113883.10.20.22.2.22');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.22.1');
        }
        el.entries = entries;
        return el;
      case 'functional_statuses':
        el = this.template('2.16.840.1.113883.10.20.22.2.14');
        el.entries = entries;
        return el;
      case 'immunizations':
        el = this.template('2.16.840.1.113883.10.20.22.2.2.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.2');
        }
        el.entries = entries;
        return el;
      case 'instructions':
        el = this.template('2.16.840.1.113883.10.20.22.2.45');
        el.entries = entries;
        return el;
      case 'results':
        el = this.template('2.16.840.1.113883.10.20.22.2.3.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.3');
        }
        el.entries = entries;
        return el;
      case 'medications':
        el = this.template('2.16.840.1.113883.10.20.22.2.1.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.1');
        }
        el.entries = entries;
        return el;
      case 'problems':
        el = this.template('2.16.840.1.113883.10.20.22.2.5.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.5');
        }
        el.entries = entries;
        return el;
      case 'procedures':
        el = this.template('2.16.840.1.113883.10.20.22.2.7.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.7');
        }
        el.entries = entries;
        return el;
      case 'social_history':
        el = this.template('2.16.840.1.113883.10.20.22.2.17');
        el.entries = entries;
        return el;
      case 'vitals':
        el = this.template('2.16.840.1.113883.10.20.22.2.4.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.4');
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
