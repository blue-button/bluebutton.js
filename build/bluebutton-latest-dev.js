/**
 * BlueButton.js
 */

// v.0.0.8



// core.js - Essential shared functionality

var Core = function () {
  
  // properties
  var ElementWrapper = function (el) {
    return {
      el: el,
      template: Core.template,
      tag: Core.tag,
      elsByTag: Core.elsByTag,
      attr: Core.attr,
      val: Core.val
    }
  };
  
  // methods
  
  // Cross-browser XML parsing
  var parseXML = function (data) {
    // Must be a string
    if (!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null;
    }
    
    var xml, tmp;
    
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
    
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null;
    }
    
    return wrapElement(xml);
  };
  
  var wrapElement = function (el) {
    // el is an array of elements
    if (el.length) {
      var els = [];
      for (var i = 0; i < el.length; i++) {
        els.push(ElementWrapper(el[i]));
      }
      return els;
    
    // el is a single element
    } else {
      return ElementWrapper(el);
    }
  };
  
  var emptyEl = function () {
    var el = document.createElement('empty');
    return wrapElement(el);
  };
  
  var tagAttrVal = function (el, tag, attr, value) {
    el = el.getElementsByTagName(tag);
    for (var i = 0; i < el.length; i++) {
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  var template = function (templateId) {
    var el = tagAttrVal(this.el, 'templateId', 'root', templateId);
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el.parentNode);
    }
  };
  
  var tag = function (tag) {
    var el = this.el.getElementsByTagName(tag)[0];
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el);
    }
  };
  
  var elsByTag = function (tag) {
    return wrapElement(this.el.getElementsByTagName(tag));
  };
  
  var attr = function (attr) {
    if (!this.el) { return null; }
    return this.el.getAttribute(attr);
  };
  
  var val = function () {
    if (!this.el) { return null; }
    try {
      return this.el.childNodes[0].nodeValue;
    } catch (e) {
      return null;
    }
  };
  
  var parseDate = function (str) {
    if (!str || typeof str !== "string") {
      console.log("Error: date is not a string");
      return null;
    }
    var year = str.substr(0, 4);
    var month = str.substr(4, 2);
    var day = str.substr(6, 2);
    return new Date(year, month, day);
  };
  
  return {
    parseXML: parseXML,
    wrapElement: wrapElement,
    template: template,
    tag: tag,
    elsByTag: elsByTag,
    attr: attr,
    val: val,
    parseDate: parseDate
  };
  
}();


// allergies.js

var Allergies = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date_range: {
          start: raw[i].start_date,
          end: raw[i].end_date
        },
        name: raw[i].name,
        code: raw[i].code,
        code_system: raw[i].code_system,
        code_system_name: raw[i].code_system_name,
        status: raw[i].status,
        severity: raw[i].severity,
        reaction: {
          name: raw[i].reaction_name,
          code: raw[i].reaction_code,
          code_system: raw[i].reaction_code_system
        },
        reaction_type: {
          name: raw[i].reaction_type_name,
          code: raw[i].reaction_type_code,
          code_system: raw[i].reaction_code_system,
          code_system_name: raw[i].reaction_type_code_system_name
        },
        allergen: {
          name: raw[i].allergen_name,
          code: raw[i].allergen_code,
          code_system: raw[i].allergen_code_system,
          code_system_name: raw[i].allergen_code_system_name
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
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
        name: name,
        start_date: start_date,
        end_date: end_date,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        reaction_type_name: reaction_type_name,
        reaction_type_code: reaction_type_code,
        reaction_type_code_system: reaction_type_code_system,
        reaction_type_code_system_name: reaction_type_code_system_name,
        reaction_name: reaction_name,
        reaction_code: reaction_code,
        reaction_code_system: reaction_code_system,
        severity: severity,
        allergen_name: allergen_name,
        allergen_code: allergen_code,
        allergen_code_system: allergen_code_system,
        allergen_code_system_name: allergen_code_system_name
      });
    }
    
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.83.102');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = el.tag('low').attr('value'),
          end_date = el.tag('high').attr('value');
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('code');
      var name = el.tag('originalText').val(),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      // value => reaction_type
      el = entry.template('2.16.840.1.113883.10.20.1.54').tag('value');
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
      var allergen_name = entry.tag('participant').tag('name').val(),
          allergen_code = el.attr('code'),
          allergen_code_system = el.attr('codeSystem'),
          allergen_code_system_name = el.attr('codeSystemName');
      
      // status
      el = entry.template('2.16.840.1.113883.10.20.22.4.28').tag('value');
      var status = el.attr('displayName');
      
      data.push({
        name: name,
        start_date: start_date,
        end_date: end_date,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        reaction_type_name: reaction_type_name,
        reaction_type_code: reaction_type_code,
        reaction_type_code_system: reaction_type_code_system,
        reaction_type_code_system_name: reaction_type_code_system_name,
        reaction_name: reaction_name,
        reaction_code: reaction_code,
        reaction_code_system: reaction_code_system,
        severity: severity,
        allergen_name: allergen_name,
        allergen_code: allergen_code,
        allergen_code_system: allergen_code_system,
        allergen_code_system_name: allergen_code_system_name
      });
    }
    
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// demographics.js

var Demographics = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var data;
    
    switch (type) {
      case 'ccda':
        data = processCCDA(source);
        break;
      case 'va_c32':
        data = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    return {
      name: {
        prefix: data.prefix,
        given: data.given,
        family: data.family
      },
      dob: data.dob,
      gender: data.gender,
      marital_status: data.marital_status,
      address: {
       street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country
      },
      phone: {
        home: data.home,
        work: data.work,
        mobile: data.mobile
      },
      email: data.email,
      language: data.language,
      race: data.race,
      ethnicity: data.ethnicity,
      religion: data.religion,
      birthplace: {
        state: data.birthplace_state,
        zip: data.birthplace_zip,
        country: data.birthplace_country
      },
      guardian: {
        name: {
          given: data.guardian_given,
          family:  data.guardian_family
        },
        relationship: data.guardian_relationship,
        address: {
          street: data.guardian_street,
          city: data.guardian_city,
          state: data.guardian_state,
          zip: data.guardian_zip,
          country: data.guardian_country
        },
        phone: {
          home: data.guardian_home
        }
      },
      provider: {
        organization: data.provider_organization,
        phone: data.provider_phone,
        address: {
          street: data.provider_street,
          city: data.provider_city,
          state: data.provider_state,
          zip: data.provider_zip,
          country: data.provider_country
        }
      }
    };
  };
  
  var processCCDA = function (xmlDOM) {
    var data = {}, el, els, patient;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.1.1');
    patient = el.tag('patientRole');
    el = patient.tag('patient').tag('name');
    data.prefix = el.tag('prefix').val();
    
    els = el.elsByTag('given');
    data.given = [];
    
    for (var i = 0; i < els.length; i++) {
      data.given.push(els[i].val());
    }
    
    data.family = el.tag('family').val();
    
    el = patient.tag('patient');
    data.dob = parseDate(el.tag('birthTime').attr('value'));
    data.gender = el.tag('administrativeGenderCode').attr('displayName');
    data.marital_status = el.tag('maritalStatusCode').attr('displayName');
    
    el = patient.tag('addr');
    els = el.elsByTag('streetAddressLine');
    data.street = [];
    
    for (var i = 0; i < els.length; i++) {
      data.street.push(els[i].val());
    }
    
    data.city = el.tag('city').val();
    data.state = el.tag('state').val();
    data.zip = el.tag('postalCode').val();
    data.country = el.tag('country').val();
    
    el = patient.tag('telecom');
    data.home = el.attr('value');
    data.work = null;
    data.mobile = null;
    
    data.email = null;
    
    data.language = patient.tag('languageCommunication').tag('languageCode').attr('code');
    data.race = patient.tag('raceCode').attr('displayName');
    data.ethnicity = patient.tag('ethnicGroupCode').attr('displayName');
    data.religion = patient.tag('religiousAffiliationCode').attr('displayName');
    
    el = patient.tag('birthplace');
    data.birthplace_state = el.tag('state').val();
    data.birthplace_zip = el.tag('postalCode').val();
    data.birthplace_country = el.tag('country').val();
    
    el = patient.tag('guardian');
    data.guardian_relationship = el.tag('code').attr('displayName');
    data.guardian_home = el.tag('telecom').attr('value');
    el = el.tag('guardianPerson');
    
    els = el.elsByTag('given');
    data.guardian_given = [];
    
    for (var i = 0; i < els.length; i++) {
      data.guardian_given.push(els[i].val());
    }
    
    data.guardian_family = el.tag('family').val();
    
    el = patient.tag('guardian').tag('addr');
    
    els = el.elsByTag('streetAddressLine');
    data.guardian_street = [];
    
    for (var i = 0; i < els.length; i++) {
      data.guardian_street.push(els[i].val());
    }
    
    data.guardian_city = el.tag('city').val();
    data.guardian_state = el.tag('state').val();
    data.guardian_zip = el.tag('postalCode').val();
    data.guardian_country = el.tag('country').val();
    
    el = patient.tag('providerOrganization');
    data.provider_organization = el.tag('name').val();
    data.provider_phone = el.tag('telecom').attr('value');
    
    els = el.elsByTag('streetAddressLine');
    data.provider_street = [];
    
    for (var i = 0; i < els.length; i++) {
      data.provider_street.push(els[i].val());
    }
    
    data.provider_city = el.tag('city').val();
    data.provider_state = el.tag('state').val();
    data.provider_zip = el.tag('postalCode').val();
    data.provider_country = el.tag('country').val();
    
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = {}, el, els, patient;
    
    el = xmlDOM.template('1.3.6.1.4.1.19376.1.5.3.1.1.1');
    patient = el.tag('patientRole');
    el = patient.tag('patient').tag('name');
    data.prefix = el.tag('prefix').val();
    
    els = el.elsByTag('given');
    data.given = [];
    
    for (var i = 0; i < els.length; i++) {
      data.given.push(els[i].val());
    }
    
    data.family = el.tag('family').val();
    
    el = patient.tag('patient');
    data.dob = parseDate(el.tag('birthTime').attr('value'));
    data.gender = el.tag('administrativeGenderCode').attr('displayName');
    data.marital_status = el.tag('maritalStatusCode').attr('displayName');
    
    el = patient.tag('addr');
    els = el.elsByTag('streetAddressLine');
    data.street = [];
    
    for (var i = 0; i < els.length; i++) {
      data.street.push(els[i].val());
    }
    
    data.city = el.tag('city').val();
    data.state = el.tag('state').val();
    data.zip = el.tag('postalCode').val();
    data.country = el.tag('country').val();
    
    el = patient.tag('telecom');
    data.home = el.attr('value');
    data.work = null;
    data.mobile = null;
    
    data.email = null;
    
    data.language = patient.tag('languageCommunication').tag('languageCode').attr('code');
    data.race = patient.tag('raceCode').attr('displayName');
    data.ethnicity = patient.tag('ethnicGroupCode').attr('displayName');
    data.religion = patient.tag('religiousAffiliationCode').attr('displayName');
    
    el = patient.tag('birthplace');
    data.birthplace_state = el.tag('state').val();
    data.birthplace_zip = el.tag('postalCode').val();
    data.birthplace_country = el.tag('country').val();
    
    el = patient.tag('guardian');
    data.guardian_relationship = el.tag('code').attr('displayName');
    data.guardian_home = el.tag('telecom').attr('value');
    el = el.tag('guardianPerson');
    
    els = el.elsByTag('given');
    data.guardian_given = [];
    
    for (var i = 0; i < els.length; i++) {
      data.guardian_given.push(els[i].val());
    }
    
    data.guardian_family = el.tag('family').val();
    
    el = patient.tag('guardian').tag('addr');
    
    els = el.elsByTag('streetAddressLine');
    data.guardian_street = [];
    
    for (var i = 0; i < els.length; i++) {
      data.guardian_street.push(els[i].val());
    }
    
    data.guardian_city = el.tag('city').val();
    data.guardian_state = el.tag('state').val();
    data.guardian_zip = el.tag('postalCode').val();
    data.guardian_country = el.tag('country').val();
    
    el = patient.tag('providerOrganization');
    data.provider_organization = el.tag('name').val();
    data.provider_phone = el.tag('telecom').attr('value');
    
    els = el.elsByTag('streetAddressLine');
    data.provider_street = [];
    
    for (var i = 0; i < els.length; i++) {
      data.provider_street.push(els[i].val());
    }
    
    data.provider_city = el.tag('city').val();
    data.provider_state = el.tag('state').val();
    data.provider_zip = el.tag('postalCode').val();
    data.provider_country = el.tag('country').val();
    
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// encounters.js

var Encounters = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date: raw[i].date,
        name: raw[i].name,
        code: raw[i].code,
        code_system: raw[i].code_system,
        code_system_name: raw[i].code_system_name,
        code_system_version: raw[i].code_system_version,
        finding: {
          name: raw[i].finding_name,
          code: raw[i].finding_code,
          code_system: raw[i].finding_code_system
        },
        translation: {
          name: raw[i].translation_name,
          code: raw[i].translation_code,
          code_system: raw[i].translation_code_system,
          code_system_name: raw[i].translation_code_system_name
        },
        performer: {
          name: raw[i].performer_name,
          code: raw[i].performer_code,
          code_system: raw[i].performer_code_system,
          code_system_name: raw[i].performer_code_system_name
        },
        location: {
          organization: raw[i].organization,
          street: raw[i].street,
          city: raw[i].city,
          state: raw[i].state,
          zip: raw[i].zip,
          country: raw[i].country
        }
      });
    }
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.22.1');
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
        finding_name: finding_name,
        finding_code: finding_code,
        finding_code_system: finding_code_system,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        performer_name: performer_name,
        performer_code_system: performer_code_system,
        performer_code_system_name: performer_code_system_name,
        organization: organization,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
      });
    }
    
    return data;
  };
  
 var processVAC32 = function (xmlDOM) {
   var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.3');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      var date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
      
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
        finding_name: finding_name,
        finding_code: finding_code,
        finding_code_system: finding_code_system,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        performer_name: performer_name,
        performer_code_system: performer_code_system,
        performer_code_system_name: performer_code_system_name,
        organization: organization,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country
      });
    }
    
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// immunizations.js

var Immunizations = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date: raw[i].date,
        product: {
          name: raw[i].product_name,
          code: raw[i].product_code,
          code_system: raw[i].product_code_system,
          code_system_name: raw[i].product_code_system_name,
          translation: {
            name: raw[i].translation_name,
            code: raw[i].translation_code,
            code_system: raw[i].translation_code_system,
            code_system_name: raw[i].translation_code_system_name
          }
        },
        route: {
          name: raw[i].route_name,
          code: raw[i].route_code,
          code_system: raw[i].route_code_system,
          code_system_name: raw[i].route_code_system_name
        },
        instructions: raw[i].instructions_text,
        education_type: {
          name: raw[i].education_name,
          code: raw[i].education_code,
          code_system: raw[i].education_code_system
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.2');
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
        product_name: product_name,
        product_code: product_code,
        product_code_system: product_code_system,
        product_code_system_name: product_code_system_name,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        route_name: route_name,
        route_code: route_code,
        route_code_system: route_code_system,
        route_code_system_name: route_code_system_name,
        instructions_text: instructions_text,
        education_name: education_name,
        education_code: education_code,
        education_code_system: education_code_system
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.6');
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
        product_name: product_name,
        product_code: product_code,
        product_code_system: product_code_system,
        product_code_system_name: product_code_system_name,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        route_name: route_name,
        route_code: route_code,
        route_code_system: route_code_system,
        route_code_system_name: route_code_system_name,
        instructions_text: instructions_text,
        education_name: education_name,
        education_code: education_code,
        education_code_system: education_code_system
      });
    }
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// labs.js

var Labs = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var panels, data = [];
    
    switch (type) {
      case 'ccda':
        panels = processCCDA(source);
        break;
      case 'va_c32':
        panels = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i];
      var panel = {
        name: p.name,
        code: p.code,
        code_system: p.code_system,
        code_system_name: p.code_system_name
      }
      
      var results = [];
      
      for (var j = 0; j < p.results.length; j++) {
        var r = p.results[j];
        results.push({
          date: r.date,
          name: r.name,
          value: r.value,
          unit: r.unit,
          code: r.code,
          code_system: r.code_system,
          code_system_name: r.code_system_name,
          reference: {
            low: r.reference_low,
            high: r.reference_high
          }
        });
      }
      
      panel.results = results;
      data.push(panel);
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.3.1');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          panel_code_system = el.attr('codeSystem'),
          panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = el.attr('value'),
            unit = el.attr('unit');
        
        // reference range may not be present
        reference_low = null;
        reference_high = null;
        
        results_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          reference_low: reference_low,
          reference_high: reference_high
        });
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        code_system: panel_code_system,
        code_system_name: panel_code_system_name,
        results: results_data
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.14');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      // panel
      el = entry.tag('code');
      var panel_name = el.attr('displayName'),
          panel_code = el.attr('code'),
          panel_code_system = el.attr('codeSystem'),
          panel_code_system_name = el.attr('codeSystemName');
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        var date = parseDate(result.tag('effectiveTime').attr('value'));
        
        el = result.tag('code');
        var name = el.tag('originalText').val(),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = el.attr('value'),
            unit = el.attr('unit');
        
        // reference range may not be present
        reference_low = null;
        reference_high = null;
        
        results_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          reference_low: reference_low,
          reference_high: reference_high
        });
      }
      
      data.push({
        name: panel_name,
        code: panel_code,
        code_system: panel_code_system,
        code_system_name: panel_code_system_name,
        results: results_data
      });
    }
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// medications.js

var Medications = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
    var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date_range: {
          start: raw[i].start_date,
          end: raw[i].end_date
        },
        product: {
          name: raw[i].product_name,
          code: raw[i].product_code,
          code_system: raw[i].product_code_system,
          translation: {
            name: raw[i].translation_name,
            code: raw[i].translation_code,
            code_system: raw[i].translation_code_system,
            code_system_name: raw[i].translation_code_system_name
          }
        },
        dose_quantity: {
          value: raw[i].dose_value,
          unit: raw[i].dose_unit
        },
        rate_quantity: {
          value: raw[i].rate_quantity_value,
          unit: raw[i].rate_quantity_unit
        },
        precondition: {
          name: raw[i].precondition_name,
          code: raw[i].precondition_code,
          code_system: raw[i].precondition_code_system
        },
        reason: {
          name: raw[i].reason_name,
          code: raw[i].reason_code,
          code_system: raw[i].reason_code_system
        },
        route: {
          name: raw[i].route_name,
          code: raw[i].route_code,
          code_system: raw[i].route_code_system,
          code_system_name: raw[i].route_code_system_name
        },
        vehicle: {
          name: raw[i].vehicle_name,
          code: raw[i].vehicle_code,
          code_system: raw[i].vehicle_code_system,
          code_system_name: raw[i].vehicle_code_system_name
        },
        administration: {
          name: raw[i].administration_name,
          code: raw[i].administration_code,
          code_system: raw[i].administration_code_system,
          code_system_name: raw[i].administration_code_system_name
        },
        prescriber: {
          organization: raw[i].prescriber_organization,
          person: raw[i].prescriber_person
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
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
        start_date: start_date,
        end_date: end_date,
        product_name: product_name,
        product_code: product_code,
        product_code_system: product_code_system,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        dose_value: dose_value,
        dose_unit: dose_unit,
        rate_quantity_value: rate_quantity_value,
        rate_quantity_unit: rate_quantity_unit,
        precondition_name: precondition_name,
        precondition_code: precondition_code,
        precondition_code_system: precondition_code_system,
        reason_name: reason_name,
        reason_code: reason_code,
        reason_code_system: reason_code_system,
        route_name: route_name,
        route_code: route_code,
        route_code_system: route_code_system,
        route_code_system_name: route_code_system_name,
        vehicle_name: vehicle_name,
        vehicle_code: vehicle_code,
        vehicle_code_system: vehicle_code_system,
        vehicle_code_system_name: vehicle_code_system_name,
        administration_name: administration_name,
        administration_code: administration_code,
        administration_code_system: administration_code_system,
        administration_code_system_name: administration_code_system_name,
        prescriber_organization: prescriber_organization,
        prescriber_person: prescriber_person
      });
    }
    
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
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
        start_date: start_date,
        end_date: end_date,
        product_name: product_name,
        product_code: product_code,
        product_code_system: product_code_system,
        translation_name: translation_name,
        translation_code: translation_code,
        translation_code_system: translation_code_system,
        translation_code_system_name: translation_code_system_name,
        dose_value: dose_value,
        dose_unit: dose_unit,
        rate_quantity_value: rate_quantity_value,
        rate_quantity_unit: rate_quantity_unit,
        precondition_name: precondition_name,
        precondition_code: precondition_code,
        precondition_code_system: precondition_code_system,
        reason_name: reason_name,
        reason_code: reason_code,
        reason_code_system: reason_code_system,
        route_name: route_name,
        route_code: route_code,
        route_code_system: route_code_system,
        route_code_system_name: route_code_system_name,
        vehicle_name: vehicle_name,
        vehicle_code: vehicle_code,
        vehicle_code_system: vehicle_code_system,
        vehicle_code_system_name: vehicle_code_system_name,
        administration_name: administration_name,
        administration_code: administration_code,
        administration_code_system: administration_code_system,
        administration_code_system_name: administration_code_system_name,
        prescriber_organization: prescriber_organization,
        prescriber_person: prescriber_person
      });
    }
    
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// problems.js

var Problems = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date_range: {
          start: raw[i].start_date,
          end: raw[i].end_date
        },
        name: raw[i].name,
        status: raw[i].status,
        age: raw[i].age,
        code: raw[i].code,
        code_system: raw[i].code_system
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.5');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      var age = parseInt(el.tag('value').attr('value'));
      
      data.push({
        start_date: start_date,
        end_date: end_date,
        name: name,
        code: code,
        code_system: code_system,
        status: status,
        age: age
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.11');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('code');
      var name = el.tag('originalText').val(),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      var age = parseInt(el.tag('value').attr('value'));
      
      data.push({
        start_date: start_date,
        end_date: end_date,
        name: name,
        code: code,
        code_system: code_system,
        status: status,
        age: age
      });
    }
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };

}();


// procedures.js

var Procedures = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var raw, data = [];
    
    switch (type) {
      case 'ccda':
        raw = processCCDA(source);
        break;
      case 'va_c32':
        raw = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < raw.length; i++) {
      data.push({
        date: raw[i].date,
        name: raw[i].name,
        code: raw[i].code,
        code_system: raw[i].code_system,
        specimen: {
          name: raw[i].specimen_name,
          code: raw[i].specimen_code,
          code_system: raw[i].specimen_code_system
        },
        performer: {
          organization: raw[i].organization,
          street: raw[i].street,
          city: raw[i].city,
          state: raw[i].state,
          zip: raw[i].zip,
          country: raw[i].country,
          phone: raw[i].phone
        },
        device: {
          name: raw[i].device_name,
          code: raw[i].device_code,
          code_system: raw[i].device_code_system
        }
      });
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.7');
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
        specimen_name: specimen_name,
        specimen_code: specimen_code,
        specimen_code_system: specimen_code_system,
        organization: organization,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country,
        device_name: device_name,
        device_code: device_code,
        device_code_system: device_code_system
      });
    }
    return data;
  };
  
  var processVAC32 = function (xmlDOM) {
    var data = [], el, els, entries, entry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.12');
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.tag('low').attr('value'));
      
      el = entry.tag('code');
      var name = el.tag('originalText').val(),
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
        specimen_name: specimen_name,
        specimen_code: specimen_code,
        specimen_code_system: specimen_code_system,
        organization: organization,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country,
        device_name: device_name,
        device_code: device_code,
        device_code_system: device_code_system
      });
    }
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };
  
}();


// vitals.js

var Vitals = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    var entries, data = [];
    
    switch (type) {
      case 'ccda':
        entries = processCCDA(source);
        break;
      case 'va_c32':
        entries = processVAC32(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
    
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var entry = {
        date: e.date
      }
      
      var results = [];
      
      for (var j = 0; j < e.results.length; j++) {
        var r = e.results[j];
        results.push({
          name: r.name,
          code: r.code,
          code_system: r.code_system,
          code_system_name: r.code_system_name,
          value: r.value,
          unit: r.unit
        });
      }
      
      entry.results = results;
      data.push(entry);
    }
    
    return data;
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.4.1');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var entry_date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseInt(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
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
  
  var processVAC32 = function (xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.1.16');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.attr('value'));
      
      results = entry.elsByTag('component');
      
      for (var j = 0; j < results.length; j++) {
        result = results[j];
        
        // Results
        
        el = result.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');
        
        el = result.tag('value');
        var value = parseInt(el.attr('value')),
            unit = el.attr('unit');
        
        results_data.push({
          name: name,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          value: value,
          unit: unit
        });
      }
      
      data.push({
        date: date,
        results: results_data
      });
    }
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };
  
}();


// bluebutton.js - The Public Object and Interface

var BlueButton = function (source) {
  // dependancies
  
  // properties
  var xmlDOM = null,
      type = '',
      data = {};
  
  // private methods
  var addMethods = function (objects) {
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = function () { return JSON.stringify(this, null, 2) };
    };
  };
  
  // public methods
  var doc = function () { return data.document };
  var allergies = function () { return data.allergies };
  var demographics = function () { return data.demographics };
  var encounters = function () { return data.encounters };
  var immunizations = function () { return data.immunizations };
  var labs = function () { return data.labs };
  var medications = function () { return data.medications };
  var problems = function () { return data.problems };
  var procedures = function () { return data.procedures };
  var vitals = function () { return data.vitals };
  
  // init
  
  // Parse as XML
  // Remove leading and trailing whitespace
  source = source.replace(/^\s+|\s+$/g,'');
  if (source.substr(0, 5) == "<?xml") {
    xmlDOM = Core.parseXML(source);
    
    // Detect document type (CCDA or VA C32)
    if (xmlDOM.template('1.3.6.1.4.1.19376.1.5.3.1.1.1')
      .el.tagName.toLowerCase() == 'empty') {
      type = 'ccda';
    } else {
      type = 'va_c32';
    }
    
    data.document = { type: type };
    data.allergies = Allergies.process(xmlDOM, type);
    data.demographics  = Demographics.process(xmlDOM, type);
    data.encounters = Encounters.process(xmlDOM, type);
    data.immunizations = Immunizations.process(xmlDOM, type);
    data.labs = Labs.process(xmlDOM, type);
    data.medications = Medications.process(xmlDOM, type);
    data.problems = Problems.process(xmlDOM, type);
    data.procedures = Procedures.process(xmlDOM, type);
    data.vitals = Vitals.process(xmlDOM, type);
    
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
    
  // parse as JSON
  } else {
    type = 'json';
    
    try {
      var json = JSON.parse(source);
    } catch (e) {
      console.log("BB Exception: Could not parse JSON");
    }
    
    data.document = { type: type };
    data.allergies = Allergies.process(json, type);
    data.demographics  = Demographics.process(json, type);
    data.encounters = Encounters.process(json, type);
    data.immunizations = Immunizations.process(json, type);
    data.labs = Labs.process(json, type);
    data.medications = Medications.process(json, type);
    data.problems = Problems.process(json, type);
    data.procedures = Procedures.process(json, type);
    data.vitals = Vitals.process(json, type);
  }
  
  return {
    data: data,
    xmlDOM: xmlDOM,
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

window.BlueButton = BlueButton;
