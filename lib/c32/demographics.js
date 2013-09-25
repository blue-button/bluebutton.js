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
