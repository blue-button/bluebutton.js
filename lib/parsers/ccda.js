/*
 * Parses a CCDA document
 */

Parsers.CCDA = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  // Parse document author /////////////////////////////////////////////////////
  var doc = ccda.section('document');
  
  var author = doc.tag('author');
  el = author.tag('assignedPerson').tag('name');
  var name_dict = parseName(el);
  
  el = author.tag('addr');
  var address_dict = parseAddress(el);
  
  el = author.tag('telecom');
  var work_phone = el.attr('value');
  
  data.document = {
    author: {
      name: name_dict,
      address: address_dict,
      phone: {
        work: work_phone
      }
    }
  };
  
  // Parse allergies ///////////////////////////////////////////////////////////
  data.allergies = [];
  
  var allergies = ccda.section('allergies');
  
  allergies.entries().each(function(entry) {
    
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
    
    data.allergies.push({
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
  });
  
  
  // Parse demographics ////////////////////////////////////////////////////////
  var demographics = ccda.section('demographics');
  
  var patient = demographics.tag('patientRole');
  el = patient.tag('patient').tag('name');
  var patient_name_dict = parseName(el);
  
  el = patient.tag('patient');
  var dob = parseDate(el.tag('birthTime').attr('value')),
      gender = Core.Codes.gender(el.tag('administrativeGenderCode').attr('code')),
      marital_status = Core.Codes.maritalStatus(el.tag('maritalStatusCode').attr('code'));
  
  el = patient.tag('addr');
  var patient_address_dict = parseAddress(el);
  
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
  var birthplace_dict = parseAddress(el);
  
  el = patient.tag('guardian');
  var guardian_relationship = el.tag('code').attr('displayName'),
      guardian_home = el.tag('telecom').attr('value');
  
  el = el.tag('guardianPerson').tag('name');
  var guardian_name_dict = parseName(el);
  
  el = patient.tag('guardian').tag('addr');
  var guardian_address_dict = parseAddress(el);
  
  el = patient.tag('providerOrganization');
  var provider_organization = el.tag('name').val(),
      provider_phone = el.tag('telecom').attr('value');
  
  var provider_address_dict = parseAddress(el.tag('addr'));
  
  data.demographics = {
    name: patient_name_dict,
    dob: dob,
    gender: gender,
    marital_status: marital_status,
    address: patient_address_dict,
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
      state: birthplace_dict.state,
      zip: birthplace_dict.zip,
      country: birthplace_dict.country
    },
    guardian: {
      name: {
        given: guardian_name_dict.given,
        family: guardian_name_dict.family
      },
      relationship: guardian_relationship,
      address: guardian_address_dict,
      phone: {
        home: guardian_home
      }
    },
    provider: {
      organization: provider_organization,
      phone: provider_phone,
      address: provider_address_dict
    }
  };
  
  
  // Parse encounters //////////////////////////////////////////////////////////
  data.encounters = [];
  
  var encounters = ccda.section('encounters');
  
  encounters.entries().each(function(entry) {
    
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
    
    var location_dict = parseAddress(el);
    location_dict.organization = organization;
    
    data.encounters.push({
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
      location: location_dict
    });
  });
  
  
  // Parse immunizations ///////////////////////////////////////////////////////
  data.immunizations = [];
  
  var immunizations = ccda.section('immunizations');
  
  immunizations.entries().each(function(entry) {
    
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
    
    data.immunizations.push({
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
  });
  
  
  // Parse labs ////////////////////////////////////////////////////////////////
  data.labs = [];
  
  var labs = ccda.section('labs');
  
  labs.entries().each(function(entry) {
    
    // panel
    el = entry.tag('code');
    var panel_name = el.attr('displayName'),
        panel_code = el.attr('code'),
        panel_code_system = el.attr('codeSystem'),
        panel_code_system_name = el.attr('codeSystemName');
    
    var result;
    var results = entry.elsByTag('component');
    var results_data = [];
    
    for (var i = 0; i < results.length; i++) {
      result = results[i];
      
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
      var reference_range_text = el.tag('observationRange').tag('text').val(),
          reference_range_low_unit = el.tag('observationRange').tag('low').attr('unit'),
          reference_range_low_value = el.tag('observationRange').tag('low').attr('value'),
          reference_range_high_unit = el.tag('observationRange').tag('high').attr('unit'),
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
    
    data.labs.push({
      name: panel_name,
      code: panel_code,
      code_system: panel_code_system,
      code_system_name: panel_code_system_name,
      results: results_data
    });
  });
  
  
  // Parse medications /////////////////////////////////////////////////////////
  data.medications = [];
  
  var medications = ccda.section('medications');
  
  medications.entries().each(function(entry) {
    
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
        precondition_code_system = el.attr('codeSystem');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.19').tag('value');
    var reason_name = el.attr('displayName'),
        reason_code = el.attr('code'),
        reason_code_system = el.attr('codeSystem');
    
    el = entry.tag('routeCode');
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
    
    data.medications.push({
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
  });
  
  
  // Parse problems ////////////////////////////////////////////////////////////
  data.problems = [];
  
  var problems = ccda.section('problems');
  
  problems.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var start_date = parseDate(el.tag('low').attr('value')),
        end_date = parseDate(el.tag('high').attr('value'));
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('value');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('translation');
    var translation_name = el.attr('displayName'),
      translation_code = el.attr('code'),
      translation_code_system = el.attr('codeSystem'),
      translation_code_system_name = el.attr('codeSystemName');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.6');
    var status = el.tag('value').attr('displayName');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.31');
    var age = parseFloat(el.tag('value').attr('value'));
    
    data.problems.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      name: name,
      status: status,
      age: age,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      translation: {
        name: translation_name,
        code: translation_code,
        code_system: translation_code_system,
        code_system_name: translation_code_system_name
      }
    });
  });
  
  
  // Parse procedures //////////////////////////////////////////////////////////
  data.procedures = [];
  
  var procedures = ccda.section('procedures');
  
  procedures.entries().each(function(entry) {
    
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
    
    var performer_dict = parseAddress(el);
    performer_dict.organization = organization;
    performer_dict.phone = phone;
    
    // participant => device
    el = entry.tag('participant').tag('code');
    var device_name = el.attr('displayName'),
        device_code = el.attr('code'),
        device_code_system = el.attr('codeSystem');
    
    data.procedures.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      specimen: {
        name: specimen_name,
        code: specimen_code,
        code_system: specimen_code_system
      },
      performer: performer_dict,
      device: {
        name: device_name,
        code: device_code,
        code_system: device_code_system
      }
    });
  });
  
  
  // Parse vitals //////////////////////////////////////////////////////////////
  data.vitals = [];
  
  var vitals = ccda.section('vitals');
  
  vitals.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var entry_date = parseDate(el.attr('value'));
    
    var result;
    var results = entry.elsByTag('component');
    var results_data = [];
    
    for (var i = 0; i < results.length; i++) {
      result = results[i];
      
      el = result.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      el = result.tag('value');
      var value = parseFloat(el.attr('value')),
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
    
    data.vitals.push({
      date: entry_date,
      results: results_data
    });
  });
  
  
  data.json               = Core.json;
  data.document.json      = Core.json;
  data.allergies.json     = Core.json;
  data.demographics.json  = Core.json;
  data.encounters.json    = Core.json;
  data.immunizations.json = Core.json;
  data.labs.json          = Core.json;
  data.medications.json   = Core.json;
  data.problems.json      = Core.json;
  data.procedures.json    = Core.json;
  data.vitals.json        = Core.json;
  
  // Return the parsed data
  return data;
  
};
