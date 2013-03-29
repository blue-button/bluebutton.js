// demographics.js

var Demographics = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (xmlDOM, type) {
    var data;
    
    switch (type) {
      case 'ccda':
        data = parseCCDA(xmlDOM);
        break;
      case 'va_c32':
        data = parseVAC32(xmlDOM);
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
  
  var parseCCDA = function (xmlDOM) {
    var data = {}, el, patient;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.1.1');
    patient = el.tag('patientRole');
    
    el = patient.tag('patient').tag('name');
    data.prefix = el.tag('prefix').val(),
    data.given = el.tag('given').val(),
    data.family = el.tag('family').val();
    
    el = patient.tag('patient');
    data.dob = parseDate(el.tag('birthTime').attr('value')),
    data.gender = el.tag('administrativeGenderCode').attr('displayName'),
    data.marital_status = el.tag('maritalStatusCode').attr('displayName');
    
    el = patient.tag('addr');
    data.street = el.tag('streetAddressLine').val(),
    data.city = el.tag('city').val(),
    data.state = el.tag('state').val(),
    data.zip = el.tag('postalCode').val(),
    data.country = el.tag('country').val();
    
    el = patient.tag('telecom');
    data.home = el.attr('value'),
    data.work = null,
    data.mobile = null;
    
    data.email = null;
    
    data.race = patient.tag('raceCode').attr('displayName'),
    data.ethnicity = patient.tag('ethnicGroupCode').attr('displayName'),
    data.religion = patient.tag('religiousAffiliationCode').attr('displayName'),
    
    el = patient.tag('birthplace');
    data.birthplace_state = el.tag('state').val(),
    data.birthplace_zip = el.tag('postalCode').val(),
    data.birthplace_country = el.tag('country').val();
    
    el = patient.tag('guardian');
    data.guardian_relationship = el.tag('code').attr('displayName'),
    data.guardian_home = el.tag('telecom').attr('value');
    el = el.tag('guardianPerson');
    data.guardian_given = el.tag('given').val(),
    data.guardian_family = el.tag('family').val(),
    
    el = patient.tag('guardian').tag('addr');
    data.guardian_street = el.tag('streetAddressLine').val(),
    data.guardian_city = el.tag('city').val(),
    data.guardian_state = el.tag('state').val(),
    data.guardian_zip = el.tag('postalCode').val(),
    data.guardian_country = el.tag('country').val();
    
    el = patient.tag('providerOrganization');
    data.provider_organization = el.tag('name').val(),
    data.provider_phone = el.tag('telecom').attr('value'),
    data.provider_street = el.tag('streetAddressLine').val(),
    data.provider_city = el.tag('city').val(),
    data.provider_state = el.tag('state').val(),
    data.provider_zip = el.tag('postalCode').val(),
    data.provider_country = el.tag('country').val();
    
    return data;
  };
  
  var parseVAC32 = function (xmlDOM) {
    var C32SectionTemplateID = '1.3.6.1.4.1.19376.1.5.3.1.1.1';
  };
  
  return {
    process: process
  };

}();
