/*
 * procedures.js
 */

CCDA.Procedures = function () {
  
  // Dependancies
  ///////////////////////////
  var parseDate = Core.parseDate;
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
  /*
   * Parse the procedures CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.7.1')
    if (el.isEmpty()) {
      el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.7');
    }
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      // 'specimen' tag not always present
      // el = entry.tag('specimen').tag('code');
      // var specimen_name = el.attr('displayName'),
      //     specimen_code = el.attr('code'),
      //     specimen_code_system = el.attr('codeSystem');
      var specimen_name = null,
          specimen_code = null,
          specimen_code_system = null;
      
      el = entry.tag('performer').tag('addr');
      var organization = el.tag('name').val(),
          phone = el.tag('telecom').attr('value');
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
          
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      // participant => device
      el = entry.tag('participant').tag('code');
      var device_name = el.attr('displayName'),
          device_code = el.attr('code'),
          device_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        specimen: {
          name: specimen_name,
          code: specimen_code,
          code_system: specimen_code_system
        },
        performer: {
          organization: organization,
          street: street,
          city: city,
          state: state,
          zip: zip,
          country: country,
          phone: phone
        },
        device: {
          name: device_name,
          code: device_code,
          code_system: device_code_system
        }
      });
    }
    
    return data;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
}();
