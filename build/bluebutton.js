(function (root, factory) {

        if (typeof exports === 'object') {
            module.exports = factory();
        }
        else if (typeof define === 'function' && define.amd) {
            define(factory);
        }
        else {
            root.BlueButton = factory();
        }

    }(this, function () {

        /* BlueButton.js -- 0.0.19 */

/*
 * core.js - Essential and shared functionality.
 */

var Core = function () {
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
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
  
  /*
   * Removes all `null` properties from an object.
   */
  var trim = function (o) {
    var y;
    for (var x in o) {
      y = o[x];
      // if (y === null || (y instanceof Object && Object.keys(y).length == 0)) {
      if (y === null) {
        delete o[x];
      }
      if (y instanceof Object) y = trim(y);
    }
    return o;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parseDate: parseDate,
    trim: trim
  };
  
}();
;

/*
 * xml.js - XML parsing functions.
 */

var XML = function () {
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////

  /*
   * A function used to wrap DOM elements in an object so methods can be added
   * to the element object. IE8 does not allow methods to be added directly to
   * DOM objects.
   */
  var wrapElement = function (el) {
    function wrapElementHelper(currentEl) {
      return {
        el: currentEl,
        template: template,
        tag: tag,
        elsByTag: elsByTag,
        attr: attr,
        val: val,
        isEmpty: isEmpty
      }
    }
    
    // el is an array of elements
    if (el.length) {
      var els = [];
      for (var i = 0; i < el.length; i++) {
        els.push(wrapElementHelper(el[i]));
      }
      return els;
    
    // el is a single element
    } else {
      return wrapElementHelper(el);
    }
  };
  
  /*
   * Find element by tag name, then attribute value.
   */
  var tagAttrVal = function (el, tag, attr, value) {
    el = el.getElementsByTagName(tag);
    for (var i = 0; i < el.length; i++) {
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  /*
   * Search for a template ID, and return its parent element.
   * Example:
   *   <templateId root="2.16.840.1.113883.10.20.22.2.17"/>
   * Can be found using:
   *   el = dom.template('2.16.840.1.113883.10.20.22.2.17');
   */
  var template = function (templateId) {
    var el = tagAttrVal(this.el, 'templateId', 'root', templateId);
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el.parentNode);
    }
  };
  
  /*
   * Search for the first occurrence of an element by tag name.
   */
  var tag = function (tag) {
    var el = this.el.getElementsByTagName(tag)[0];
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el);
    }
  };
  
  /*
   * Search for all elements by tag name.
   */
  var elsByTag = function (tag) {
    return wrapElement(this.el.getElementsByTagName(tag));
  };
  
  /*
   * Retrieve the element's attribute value. Example:
   *   value = el.attr('displayName');
   */
  var attr = function (attr) {
    if (!this.el) { return null; }
    return this.el.getAttribute(attr);
  };
  
  /*
   * Retrieve the element's value. For example, if the element is:
   *   <city>Madison</city>
   * Use:
   *   value = el.tag('city').val();
   */
  var val = function () {
    if (!this.el) { return null; }
    try {
      return this.el.childNodes[0].nodeValue;
    } catch (e) {
      return null;
    }
  };
  
  /*
   * Creates and returns an empty DOM element with tag name "empty":
   *   <empty></empty>
   */
  var emptyEl = function () {
    var el = doc.createElement('empty');
    return wrapElement(el);
  };
  
  /*
   * Determines if the element is empty, i.e.:
   *   <empty></empty>
   * This element is created by function `emptyEL`.
   */
  var isEmpty = function () {
    if (this.el.tagName.toLowerCase() == 'empty') {
      return true;
    } else {
      return false;
    }
  };
  
  // Public Methods
  ///////////////////////////
  
  /*
   * Cross-browser XML parsing supporting IE8+ and Node.js.
   */
  var parseXML = function (data) {
    // XML data must be a string
    if (!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null;
    }
    
    var xml;
    
    // Node
    if (isNode) {
      xml = jsdom.jsdom(data, jsdom.level(1, "core"));
      
    // Browser
    } else {
      
      // Standard parser
      if (window.DOMParser) {
        parser = new DOMParser();
        xml = parser.parseFromString(data, "text/xml");
        
      // IE
      } else {
        try {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        } catch (e) {
          console.log("BB ActiveX Exception: Could not parse XML");
        }
      }
    }
    
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null;
    }
    
    return wrapElement(xml);
  };
  
  // Init
  ///////////////////////////
  
  // Establish the root object, `window` in the browser, or `global` in Node.
  var root = this,
      jsdom = undefined,
      isNode = false,
      doc = root.document; // Will be `undefined` if we're in Node

  // Check if we're in Node. If so, pull in `jsdom` so we can simulate the DOM.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      isNode = true;
      jsdom = require("jsdom");
      doc = new (jsdom.level(1, "core").Document)();
    }
  }
  
  // Reveal public methods
  return {
    parseXML: parseXML
  };
  
}();
;

/*
 * codes.js
 */

var Codes = function () {
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////

  /*
   * Consistently parse a CCDA code.
   */
  var parse = function (el) {};
  
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
  
}();
;

/*
 * c32.js
 */

var C32 = function () {
  
  // Dependancies
  ///////////////////////////
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
  };
  
}();
;

/*
 * allergies.js
 */

C32.Allergies = function () {
  
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
   * Parse the allergies CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.102');

    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.3.88.11.83.6').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      // value => reaction_type
      el = entry.template('2.16.840.1.113883.3.88.11.83.6').tag('value');
      var reaction_type_name = el.attr('displayName'),
          reaction_type_code = el.attr('code'),
          reaction_type_code_system = el.attr('codeSystem'),
          reaction_type_code_system_name = el.attr('codeSystemName');
      
      // reaction
      el = entry.template('2.16.840.1.113883.10.20.1.54').tag('value');
      var reaction_name = el.attr('displayName'),
          reaction_code = el.attr('code'),
          reaction_code_system = el.attr('codeSystem');
      
      // severity
      el = entry.template('2.16.840.1.113883.10.20.1.55').tag('value');
      var severity = el.attr('displayName');
      
      // participant => allergen
      el = entry.tag('participant').tag('code');
      var allergen_name = el.attr('displayName'),
          allergen_code = el.attr('code'),
          allergen_code_system = el.attr('codeSystem'),
          allergen_code_system_name = el.attr('codeSystemName');
      
      // status
      el = entry.template('2.16.840.1.113883.10.20.1.39').tag('value');
      var status = el.attr('displayName');
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        status: status,
        severity: severity,
        reaction: {
          name: reaction_name,
          code: reaction_code,
          code_system: reaction_code_system
        },
        reaction_type: {
          name: reaction_type_name,
          code: reaction_type_code,
          code_system: reaction_type_code_system,
          code_system_name: reaction_type_code_system_name
        },
        allergen: {
          name: allergen_name,
          code: allergen_code,
          code_system: allergen_code_system,
          code_system_name: allergen_code_system_name
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
;

/*
 * demographics.js
 */

C32.Demographics = function () {
  
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
   * Parse the demographics CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = {}, el, els, patient;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.32.1');
    patient = el.tag('patientRole');
    el = patient.tag('patient').tag('name');
    var prefix = el.tag('prefix').val();
    
    els = el.elsByTag('given');
    var given = [];
    
    for (var i = 0; i < els.length; i++) {
      given.push(els[i].val());
    }
    
    var family = el.tag('family').val();
    
    el = patient.tag('patient');
    var dob = parseDate(el.tag('birthTime').attr('value')),
        gender = Codes.gender(el.tag('administrativeGenderCode').attr('code')),
        marital_status = Codes.maritalStatus(el.tag('maritalStatusCode').attr('code'));
    
    el = patient.tag('addr');
    els = el.elsByTag('streetAddressLine');
    var street = [];
    
    for (var i = 0; i < els.length; i++) {
      street.push(els[i].val());
    }
    
    var city = el.tag('city').val(),
        state = el.tag('state').val(),
        zip = el.tag('postalCode').val(),
        country = el.tag('country').val();
    
    el = patient.tag('telecom');
    var home = el.attr('value'),
        work = null,
        mobile = null;
    
    var email = null;
    
    var language = patient.tag('languageCommunication').tag('languageCode').attr('code'),
        race = patient.tag('raceCode').attr('displayName'),
        ethnicity = patient.tag('ethnicGroupCode').attr('displayName'),
        religion = patient.tag('religiousAffiliationCode').attr('displayName');
    
    el = patient.tag('birthplace');
    var birthplace_state = el.tag('state').val(),
        birthplace_zip = el.tag('postalCode').val(),
        birthplace_country = el.tag('country').val();
    
    el = patient.tag('guardian');
    var guardian_relationship = el.tag('code').attr('displayName'),
        guardian_home = el.tag('telecom').attr('value');
    el = el.tag('guardianPerson');
    
    els = el.elsByTag('given');
    var guardian_given = [];
    
    for (var i = 0; i < els.length; i++) {
      guardian_given.push(els[i].val());
    }
    
    var guardian_family = el.tag('family').val();
    
    el = patient.tag('guardian').tag('addr');
    
    els = el.elsByTag('streetAddressLine');
    var guardian_street = [];
    
    for (var i = 0; i < els.length; i++) {
      guardian_street.push(els[i].val());
    }
    
    var guardian_city = el.tag('city').val(),
        guardian_state = el.tag('state').val(),
        guardian_zip = el.tag('postalCode').val(),
        guardian_country = el.tag('country').val();
    
    el = patient.tag('providerOrganization');
    var provider_organization = el.tag('name').val(),
        provider_phone = el.tag('telecom').attr('value');
    
    els = el.elsByTag('streetAddressLine');
    var provider_street = [];
    
    for (var i = 0; i < els.length; i++) {
      provider_street.push(els[i].val());
    }
    
    var provider_city = el.tag('city').val(),
        provider_state = el.tag('state').val(),
        provider_zip = el.tag('postalCode').val(),
        provider_country = el.tag('country').val();
    
    data = {
      name: {
        prefix: prefix,
        given: given,
        family: family
      },
      dob: dob,
      gender: gender,
      marital_status: marital_status,
      address: {
       street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
      },
      phone: {
        home: home,
        work: work,
        mobile: mobile
      },
      email: email,
      language: language,
      race: race,
      ethnicity: ethnicity,
      religion: religion,
      birthplace: {
        state: birthplace_state,
        zip: birthplace_zip,
        country: birthplace_country
      },
      guardian: {
        name: {
          given: guardian_given,
          family: guardian_family
        },
        relationship: guardian_relationship,
        address: {
          street: guardian_street,
          city: guardian_city,
          state: guardian_state,
          zip: guardian_zip,
          country: guardian_country
        },
        phone: {
          home: guardian_home
        }
      },
      provider: {
        organization: provider_organization,
        phone: provider_phone,
        address: {
          street: provider_street,
          city: provider_city,
          state: provider_state,
          zip: provider_zip,
          country: provider_country
        }
      }
    };
    
    return data;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
}();
;

/*
 * encounters.js
 */

C32.Encounters = function () {
  
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
   * Parse the encounters CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.127');

    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      var date = parseDate(entry.tag('effectiveTime').attr('value'));
      if (!date) {
        var date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
      }
      
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName'),
          code_system_version = el.attr('codeSystemVersion');
      
      // finding
      el = entry.tag('value');
      var finding_name = el.attr('displayName'),
          finding_code = el.attr('code'),
          finding_code_system = el.attr('codeSystem');
      
      // translation
      el = entry.tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // performer
      el = entry.tag('performer');
      var performer_name = el.tag('name').val(),
          performer_code = el.attr('code'),
          performer_code_system = el.attr('codeSystem'),
          performer_code_system_name = el.attr('codeSystemName');

      // participant => location
      el = entry.tag('participant');
      var organization = el.tag('name').val();
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
      
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        code_system_version: code_system_version,
        finding: {
          name: finding_name,
          code: finding_code,
          code_system: finding_code_system
        },
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        },
        performer: {
          name: performer_name,
          code: performer_code,
          code_system: performer_code_system,
          code_system_name: performer_code_system_name
        },
        location: {
          organization: organization,
          street: street,
          city: city,
          state: state,
          zip: zip,
          country: country
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
;

/*
 * immunizations.js
 */

C32.Immunizations = function () {
  
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
   * Parse the immunizations CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.117');

    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // date
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      // product
      el = entry.template('2.16.840.1.113883.10.20.1.53').tag('code');
      var product_name = el.attr('displayName'),
          product_code = el.attr('code'),
          product_code_system = el.attr('codeSystem'),
          product_code_system_name = el.attr('codeSystemName');
      
      // translation
      el = entry.template('2.16.840.1.113883.10.20.1.53').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // route
      el = entry.tag('routeCode');
      var route_name = el.attr('displayName'),
          route_code = el.attr('code'),
          route_code_system = el.attr('codeSystem'),
          route_code_system_name = el.attr('codeSystemName');
      
      // instructions
      el = entry.template('2.16.840.1.113883.10.20.1.49');
      var instructions_text = el.tag('text').val();
      el = el.tag('code');
      var education_name = el.attr('displayName'),
          education_code = el.attr('code'),
          education_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        product: {
          name: product_name,
          code: product_code,
          code_system: product_code_system,
          code_system_name: product_code_system_name,
          translation: {
            name: translation_name,
            code: translation_code,
            code_system: translation_code_system,
            code_system_name: translation_code_system_name
          }
        },
        route: {
          name: route_name,
          code: route_code,
          code_system: route_code_system,
          code_system_name: route_code_system_name
        },
        instructions: instructions_text,
        education_type: {
          name: education_name,
          code: education_code,
          code_system: education_code_system
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
;

/*
 * labs.js
 */

C32.Labs = function () {
  
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
   * Parse the labs CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], results_data, el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.122');

    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];

      el = entry.tag('effectiveTime');
      var panel_date = parseDate(entry.tag('effectiveTime').attr('value'));
      if (!panel_date) {
        var panel_date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
      }
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          panel_code_system = el.attr('codeSystem'),
          panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      results_data = [];
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];

        // sometimes results organizers contain non-results. we only want results
        if (result.template('2.16.840.1.113883.10.20.1.31').val()) {
          var date = parseDate(result.tag('effectiveTime').attr('value'));
          
          el = result.tag('code');
          var name = el.attr('displayName'),
              code = el.attr('code'),
              code_system = el.attr('codeSystem'),
              code_system_name = el.attr('codeSystemName');
          
          el = result.tag('value');
          var value = parseFloat(el.attr('value')),
              unit = el.attr('unit');

          el = result.tag('referenceRange');
          var reference_range_text = el.tag('observationRange').tag('text').val();
              reference_range_low_unit = el.tag('observationRange').tag('low').attr('unit');
              reference_range_low_value = el.tag('observationRange').tag('low').attr('value');
              reference_range_high_unit = el.tag('observationRange').tag('high').attr('unit');
              reference_range_high_value = el.tag('observationRange').tag('high').attr('value');
          
          results_data.push({
            date: date,
            name: name,
            value: value,
            unit: unit,
            code: code,
            code_system: code_system,
            code_system_name: code_system_name,
            reference_range: {
              text: reference_range_text,
              low_unit: reference_range_low_unit,
              low_value: reference_range_low_value,
              high_unit: reference_range_high_unit,
              high_value: reference_range_high_value,
            }
          });
        }
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        code_system: panel_code_system,
        code_system_name: panel_code_system_name,
        date: panel_date,
        results: results_data
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
;

/*
 * medications.js
 */

C32.Medications = function () {
  
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
   * Parse the medications CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.112');

    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.tag('manufacturedProduct').tag('code');
      var product_name = el.attr('displayName'),
          product_code = el.attr('code'),
          product_code_system = el.attr('codeSystem');
      
      el = entry.tag('manufacturedProduct').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      el = entry.tag('doseQuantity');
      var dose_value = el.attr('value'),
          dose_unit = el.attr('unit');
      
      el = entry.tag('rateQuantity');
      var rate_quantity_value = el.attr('value'),
          rate_quantity_unit = el.attr('unit');
      
      el = entry.tag('precondition').tag('value');
      var precondition_name = el.attr('displayName'),
          precondition_code = el.attr('code'),
          precondition_code_system = el.attr('codeSystem'),
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('value');
      var reason_name = el.attr('displayName'),
          reason_code = el.attr('code'),
          reason_code_system = el.attr('codeSystem');
      
      el = entry.tag('routeCode')
      var route_name = el.attr('displayName'),
          route_code = el.attr('code'),
          route_code_system = el.attr('codeSystem'),
          route_code_system_name = el.attr('codeSystemName');
      
      // participant => vehicle
      el = entry.tag('participant').tag('code');
      var vehicle_name = el.attr('displayName'),
          vehicle_code = el.attr('code'),
          vehicle_code_system = el.attr('codeSystem'),
          vehicle_code_system_name = el.attr('codeSystemName');
      
      el = entry.tag('administrationUnitCode');
      var administration_name = el.attr('displayName'),
          administration_code = el.attr('code'),
          administration_code_system = el.attr('codeSystem'),
          administration_code_system_name = el.attr('codeSystemName');
      
      // performer => prescriber
      el = entry.tag('performer');
      var prescriber_organization = el.tag('name').val(),
          prescriber_person = null;
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        product: {
          name: product_name,
          code: product_code,
          code_system: product_code_system,
          translation: {
            name: translation_name,
            code: translation_code,
            code_system: translation_code_system,
            code_system_name: translation_code_system_name
          }
        },
        dose_quantity: {
          value: dose_value,
          unit: dose_unit
        },
        rate_quantity: {
          value: rate_quantity_value,
          unit: rate_quantity_unit
        },
        precondition: {
          name: precondition_name,
          code: precondition_code,
          code_system: precondition_code_system
        },
        reason: {
          name: reason_name,
          code: reason_code,
          code_system: reason_code_system
        },
        route: {
          name: route_name,
          code: route_code,
          code_system: route_code_system,
          code_system_name: route_code_system_name
        },
        vehicle: {
          name: vehicle_name,
          code: vehicle_code,
          code_system: vehicle_code_system,
          code_system_name: vehicle_code_system_name
        },
        administration: {
          name: administration_name,
          code: administration_code,
          code_system: administration_code_system,
          code_system_name: administration_code_system_name
        },
        prescriber: {
          organization: prescriber_organization,
          person: prescriber_person
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
;

/*
 * problems.js
 */

C32.Problems = function () {
  
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
   * Parse the problems CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.103');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('value');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.1.50');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.1.38');
      var age = parseFloat(el.tag('value').attr('value'));
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        status: status,
        age: age,
        code: code,
        code_system: code_system
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
;

/*
 * procedures.js
 */

C32.Procedures = function () {
  
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
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.108');
    
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
;

/*
 * vitals.js
 */

C32.Vitals = function () {
  
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
   * Parse the vitals CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], results_data, el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.119');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var entry_date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      results_data = [];
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            // code_system = el.attr('codeSystem'),
            // code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseFloat(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          // code_system: code_system,
          // code_system_name: code_system_name,
          value: value,
          unit: unit
        });
      }
      
      data.push({
        date: entry_date,
        results: results_data
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
;

/*
 * ccda.js
 */

var CCDA = function () {
  
  // Dependancies
  ///////////////////////////
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
  };
  
}();
;

/*
 * allergies.js
 */

CCDA.Allergies = function () {
  
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
   * Parse the allergies CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.6.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      // value => reaction_type
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('value');
      var reaction_type_name = el.attr('displayName'),
          reaction_type_code = el.attr('code'),
          reaction_type_code_system = el.attr('codeSystem'),
          reaction_type_code_system_name = el.attr('codeSystemName');
      
      // reaction
      el = entry.template('2.16.840.1.113883.10.20.22.4.9').tag('value');
      var reaction_name = el.attr('displayName'),
          reaction_code = el.attr('code'),
          reaction_code_system = el.attr('codeSystem');
      
      // severity
      el = entry.template('2.16.840.1.113883.10.20.22.4.8').tag('value');
      var severity = el.attr('displayName');
      
      // participant => allergen
      el = entry.tag('participant').tag('code');
      var allergen_name = el.attr('displayName'),
          allergen_code = el.attr('code'),
          allergen_code_system = el.attr('codeSystem'),
          allergen_code_system_name = el.attr('codeSystemName');
      
      // status
      el = entry.template('2.16.840.1.113883.10.20.22.4.28').tag('value');
      var status = el.attr('displayName');
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        status: status,
        severity: severity,
        reaction: {
          name: reaction_name,
          code: reaction_code,
          code_system: reaction_code_system
        },
        reaction_type: {
          name: reaction_type_name,
          code: reaction_type_code,
          code_system: reaction_type_code_system,
          code_system_name: reaction_type_code_system_name
        },
        allergen: {
          name: allergen_name,
          code: allergen_code,
          code_system: allergen_code_system,
          code_system_name: allergen_code_system_name
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
;

/*
 * demographics.js
 */

CCDA.Demographics = function () {
  
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
   * Parse the demographics CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = {}, el, els, patient;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.1.1');
    patient = el.tag('patientRole');
    el = patient.tag('patient').tag('name');
    var prefix = el.tag('prefix').val();
    
    els = el.elsByTag('given');
    var given = [];
    
    for (var i = 0; i < els.length; i++) {
      given.push(els[i].val());
    }
    
    var family = el.tag('family').val();
    
    el = patient.tag('patient');
    var dob = parseDate(el.tag('birthTime').attr('value')),
        gender = Codes.gender(el.tag('administrativeGenderCode').attr('code')),
        marital_status = Codes.maritalStatus(el.tag('maritalStatusCode').attr('code'));
    
    el = patient.tag('addr');
    els = el.elsByTag('streetAddressLine');
    var street = [];
    
    for (var i = 0; i < els.length; i++) {
      street.push(els[i].val());
    }
    
    var city = el.tag('city').val(),
        state = el.tag('state').val(),
        zip = el.tag('postalCode').val(),
        country = el.tag('country').val();
    
    el = patient.tag('telecom');
    var home = el.attr('value'),
        work = null,
        mobile = null;
    
    var email = null;
    
    var language = patient.tag('languageCommunication').tag('languageCode').attr('code'),
        race = patient.tag('raceCode').attr('displayName'),
        ethnicity = patient.tag('ethnicGroupCode').attr('displayName'),
        religion = patient.tag('religiousAffiliationCode').attr('displayName');
    
    el = patient.tag('birthplace');
    var birthplace_state = el.tag('state').val(),
        birthplace_zip = el.tag('postalCode').val(),
        birthplace_country = el.tag('country').val();
    
    el = patient.tag('guardian');
    var guardian_relationship = el.tag('code').attr('displayName'),
        guardian_home = el.tag('telecom').attr('value');
    el = el.tag('guardianPerson');
    
    els = el.elsByTag('given');
    var guardian_given = [];
    
    for (var i = 0; i < els.length; i++) {
      guardian_given.push(els[i].val());
    }
    
    var guardian_family = el.tag('family').val();
    
    el = patient.tag('guardian').tag('addr');
    
    els = el.elsByTag('streetAddressLine');
    var guardian_street = [];
    
    for (var i = 0; i < els.length; i++) {
      guardian_street.push(els[i].val());
    }
    
    var guardian_city = el.tag('city').val(),
        guardian_state = el.tag('state').val(),
        guardian_zip = el.tag('postalCode').val(),
        guardian_country = el.tag('country').val();
    
    el = patient.tag('providerOrganization');
    var provider_organization = el.tag('name').val(),
        provider_phone = el.tag('telecom').attr('value');
    
    els = el.elsByTag('streetAddressLine');
    var provider_street = [];
    
    for (var i = 0; i < els.length; i++) {
      provider_street.push(els[i].val());
    }
    
    var provider_city = el.tag('city').val(),
        provider_state = el.tag('state').val(),
        provider_zip = el.tag('postalCode').val(),
        provider_country = el.tag('country').val();
    
    data = {
      name: {
        prefix: prefix,
        given: given,
        family: family
      },
      dob: dob,
      gender: gender,
      marital_status: marital_status,
      address: {
       street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
      },
      phone: {
        home: home,
        work: work,
        mobile: mobile
      },
      email: email,
      language: language,
      race: race,
      ethnicity: ethnicity,
      religion: religion,
      birthplace: {
        state: birthplace_state,
        zip: birthplace_zip,
        country: birthplace_country
      },
      guardian: {
        name: {
          given: guardian_given,
          family: guardian_family
        },
        relationship: guardian_relationship,
        address: {
          street: guardian_street,
          city: guardian_city,
          state: guardian_state,
          zip: guardian_zip,
          country: guardian_country
        },
        phone: {
          home: guardian_home
        }
      },
      provider: {
        organization: provider_organization,
        phone: provider_phone,
        address: {
          street: provider_street,
          city: provider_city,
          state: provider_state,
          zip: provider_zip,
          country: provider_country
        }
      }
    };
    
    return data;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
}();
;

/*
 * encounters.js
 */

CCDA.Encounters = function () {
  
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
   * Parse the encounters CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.22')
    if (el.isEmpty()) {
      el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.22.1');
    }
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      var date = parseDate(entry.tag('effectiveTime').attr('value'));
      
      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName'),
          code_system_version = el.attr('codeSystemVersion');
      
      // finding
      el = entry.tag('value');
      var finding_name = el.attr('displayName'),
          finding_code = el.attr('code'),
          finding_code_system = el.attr('codeSystem');
      
      // translation
      el = entry.tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // performer
      el = entry.tag('performer').tag('code');
      var performer_name = el.attr('displayName'),
          performer_code = el.attr('code'),
          performer_code_system = el.attr('codeSystem'),
          performer_code_system_name = el.attr('codeSystemName');

      // participant => location
      el = entry.tag('participant');
      var organization = el.tag('code').attr('displayName');
      
      els = el.elsByTag('streetAddressLine');
      street = [];
      
      for (var j = 0; j < els.length; j++) {
        street.push(els[j].val());
      }
      
      var city = el.tag('city').val(),
          state = el.tag('state').val(),
          zip = el.tag('postalCode').val(),
          country = el.tag('country').val();
      
      data.push({
        date: date,
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        code_system_version: code_system_version,
        finding: {
          name: finding_name,
          code: finding_code,
          code_system: finding_code_system
        },
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        },
        performer: {
          name: performer_name,
          code: performer_code,
          code_system: performer_code_system,
          code_system_name: performer_code_system_name
        },
        location: {
          organization: organization,
          street: street,
          city: city,
          state: state,
          zip: zip,
          country: country
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
;

/*
 * immunizations.js
 */

CCDA.Immunizations = function () {
  
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
   * Parse the immunizations CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.2.1')
    if (el.isEmpty()) {
      el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.2');
    }
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // date
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      // product
      el = entry.template('2.16.840.1.113883.10.20.22.4.54').tag('code');
      var product_name = el.attr('displayName'),
          product_code = el.attr('code'),
          product_code_system = el.attr('codeSystem'),
          product_code_system_name = el.attr('codeSystemName');
      
      // translation
      el = entry.template('2.16.840.1.113883.10.20.22.4.54').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      // route
      el = entry.tag('routeCode');
      var route_name = el.attr('displayName'),
          route_code = el.attr('code'),
          route_code_system = el.attr('codeSystem'),
          route_code_system_name = el.attr('codeSystemName');
      
      // instructions
      el = entry.template('2.16.840.1.113883.10.20.22.4.20');
      var instructions_text = el.tag('text').val();
      el = el.tag('code');
      var education_name = el.attr('displayName'),
          education_code = el.attr('code'),
          education_code_system = el.attr('codeSystem');
      
      data.push({
        date: date,
        product: {
          name: product_name,
          code: product_code,
          code_system: product_code_system,
          code_system_name: product_code_system_name,
          translation: {
            name: translation_name,
            code: translation_code,
            code_system: translation_code_system,
            code_system_name: translation_code_system_name
          }
        },
        route: {
          name: route_name,
          code: route_code,
          code_system: route_code_system,
          code_system_name: route_code_system_name
        },
        instructions: instructions_text,
        education_type: {
          name: education_name,
          code: education_code,
          code_system: education_code_system
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
;

/*
 * labs.js
 */

CCDA.Labs = function () {
  
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
   * Parse the labs CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], results_data, el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.3.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          // panel_code_system = el.attr('codeSystem'),
          // panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      results_data = [];
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            // code_system = el.attr('codeSystem'),
            // code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseFloat(el.attr('value')),
            unit = el.attr('unit');
        
        // reference range may not be present
        // reference_low = null;
        // reference_high = null;
        
        results_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          // code_system: code_system,
          // code_system_name: code_system_name,
          // reference_low: reference_low,
          // reference_high: reference_high
        });
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        // code_system: panel_code_system,
        // code_system_name: panel_code_system_name,
        results: results_data
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
;

/*
 * medications.js
 */

CCDA.Medications = function () {
  
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
   * Parse the medications CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.1.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.tag('manufacturedProduct').tag('code');
      var product_name = el.attr('displayName'),
          product_code = el.attr('code'),
          product_code_system = el.attr('codeSystem');
      
      el = entry.tag('manufacturedProduct').tag('translation');
      var translation_name = el.attr('displayName'),
          translation_code = el.attr('code'),
          translation_code_system = el.attr('codeSystem'),
          translation_code_system_name = el.attr('codeSystemName');
      
      el = entry.tag('doseQuantity');
      var dose_value = el.attr('value'),
          dose_unit = el.attr('unit');
      
      el = entry.tag('rateQuantity');
      var rate_quantity_value = el.attr('value'),
          rate_quantity_unit = el.attr('unit');
      
      el = entry.tag('precondition').tag('value');
      var precondition_name = el.attr('displayName'),
          precondition_code = el.attr('code'),
          precondition_code_system = el.attr('codeSystem'),
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.19').tag('value');
      var reason_name = el.attr('displayName'),
          reason_code = el.attr('code'),
          reason_code_system = el.attr('codeSystem');
      
      el = entry.tag('routeCode')
      var route_name = el.attr('displayName'),
          route_code = el.attr('code'),
          route_code_system = el.attr('codeSystem'),
          route_code_system_name = el.attr('codeSystemName');
      
      // participant => vehicle
      el = entry.tag('participant').tag('code');
      var vehicle_name = el.attr('displayName'),
          vehicle_code = el.attr('code'),
          vehicle_code_system = el.attr('codeSystem'),
          vehicle_code_system_name = el.attr('codeSystemName');
      
      el = entry.tag('administrationUnitCode');
      var administration_name = el.attr('displayName'),
          administration_code = el.attr('code'),
          administration_code_system = el.attr('codeSystem'),
          administration_code_system_name = el.attr('codeSystemName');
      
      // performer => prescriber
      el = entry.tag('performer');
      var prescriber_organization = el.tag('name').val(),
          prescriber_person = null;
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        product: {
          name: product_name,
          code: product_code,
          code_system: product_code_system,
          translation: {
            name: translation_name,
            code: translation_code,
            code_system: translation_code_system,
            code_system_name: translation_code_system_name
          }
        },
        dose_quantity: {
          value: dose_value,
          unit: dose_unit
        },
        rate_quantity: {
          value: rate_quantity_value,
          unit: rate_quantity_unit
        },
        precondition: {
          name: precondition_name,
          code: precondition_code,
          code_system: precondition_code_system
        },
        reason: {
          name: reason_name,
          code: reason_code,
          code_system: reason_code_system
        },
        route: {
          name: route_name,
          code: route_code,
          code_system: route_code_system,
          code_system_name: route_code_system_name
        },
        vehicle: {
          name: vehicle_name,
          code: vehicle_code,
          code_system: vehicle_code_system,
          code_system_name: vehicle_code_system_name
        },
        administration: {
          name: administration_name,
          code: administration_code,
          code_system: administration_code_system,
          code_system_name: administration_code_system_name
        },
        prescriber: {
          organization: prescriber_organization,
          person: prescriber_person
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
;

/*
 * problems.js
 */

CCDA.Problems = function () {
  
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
   * Parse the problems CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.5.1')
    if (el.isEmpty()) {
      el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.5');
    }
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('value');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      var age = parseFloat(el.tag('value').attr('value'));
      
      data.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        status: status,
        age: age,
        code: code,
        code_system: code_system
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
;

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
;

/*
 * vitals.js
 */

CCDA.Vitals = function () {
  
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
   * Parse the vitals CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = [], results_data, el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.4.1');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var entry_date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      results_data = [];
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            // code_system = el.attr('codeSystem'),
            // code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseFloat(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          // code_system: code_system,
          // code_system_name: code_system_name,
          value: value,
          unit: unit
        });
      }
      
      data.push({
        date: entry_date,
        results: results_data
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
;

/*
 * bluebutton.js - The public `BlueButton` object.
 */
 
var BlueButton = function (source) {
  
  // Dependancies
  ///////////////////////////
  
  // Properties
  ///////////////////////////
  var xmlDOM = null,
      type = '',
      data = {};
  
  // Private Methods
  ///////////////////////////
  var addMethods = function (objects) {
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = function () { return JSON.stringify(this, null, 2) };
    };
  };
  
  // Public Methods
  ///////////////////////////
  var doc = function () { return data.document };
  var allergies = function () { return data.allergies };
  var demographics = function () { return data.demographics };
  var encounters = function () { return data.encounters };
  var immunizations = function () { return data.immunizations };
  var labs = function () { return data.labs };
  var medications = function () { return data.medications };
  var problems = function () { return data.problems };
  var procedures = function () { return data.procedures };
  var vitals = function (filters) {
    if (filters) {
      return Core.filters(data.vitals);
    } else {
      return data.vitals;
    }
  };
  
  // Init
  ///////////////////////////
  
  // Remove leading and trailing whitespace
  source = source.replace(/^\s+|\s+$/g,'');
  
  // Detect document type
  if (source.substr(0, 5) == "<?xml") {
    xmlDOM = XML.parseXML(source);
    
    if (!xmlDOM.template('2.16.840.1.113883.3.88.11.32.1').isEmpty()) {
      type = "c32";
    } else if(!xmlDOM.template('2.16.840.1.113883.10.20.22.1.2').isEmpty()) {
      type = "ccda";
    }
  } else {
    type = "json";
  }
  
  data.document = { type: type };
  
  switch (type) {
    case "c32":
      data.allergies =     C32.Allergies.parse(xmlDOM);
      data.demographics =  C32.Demographics.parse(xmlDOM);
      data.encounters =    C32.Encounters.parse(xmlDOM);
      data.immunizations = C32.Immunizations.parse(xmlDOM);
      data.labs =          C32.Labs.parse(xmlDOM);
      data.medications =   C32.Medications.parse(xmlDOM);
      data.problems =      C32.Problems.parse(xmlDOM);
      data.procedures =    C32.Procedures.parse(xmlDOM);
      data.vitals =        C32.Vitals.parse(xmlDOM);
      break;
    case "ccda":
      data.allergies =     CCDA.Allergies.parse(xmlDOM);
      data.demographics =  CCDA.Demographics.parse(xmlDOM);
      data.encounters =    CCDA.Encounters.parse(xmlDOM);
      data.immunizations = CCDA.Immunizations.parse(xmlDOM);
      data.labs =          CCDA.Labs.parse(xmlDOM);
      data.medications =   CCDA.Medications.parse(xmlDOM);
      data.problems =      CCDA.Problems.parse(xmlDOM);
      data.procedures =    CCDA.Procedures.parse(xmlDOM);
      data.vitals =        CCDA.Vitals.parse(xmlDOM);
      break;
    case "json":
      try {
        var json = JSON.parse(source);
      } catch (e) {
        console.log("BB Exception: Could not parse JSON");
      }
      console.log("BB Error: Blue Button JSON not yet implemented.");
      break;
  }
  
  addMethods([
    data,
    data.document,
    data.allergies,
    data.demographics,
    data.encounters,
    data.immunizations,
    data.labs,
    data.medications,
    data.problems,
    data.procedures,
    data.vitals
  ]);
  
  // Reveal public methods
  return {
    xmlDOM: xmlDOM,
    data: data,
    document: doc,
    allergies: allergies,
    demographics: demographics,
    encounters: encounters,
    immunizations: immunizations,
    labs: labs,
    medications: medications,
    problems: problems,
    procedures: procedures,
    vitals: vitals
  };
    
};

        return BlueButton;

    }));