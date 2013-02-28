// demographics.js

var Demographics = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  var sectionTemplateID = '2.16.840.1.113883.10.20.22.1.1';
  
  // methods
  var process = function (xmlDOM) {
    var data, el, patient;
    
    el = xmlDOM.template(sectionTemplateID);
    patient = el.tag('patientRole');
    
    el = patient.tag('patient').tag('name');
    var prefix = el.tag('prefix').val(),
        given = el.tag('given').val(),
        family = el.tag('family').val();
    
    el = patient.tag('patient');
    var dob = parseDate(el.tag('birthTime').attr('value')),
        gender = el.tag('administrativeGenderCode').attr('displayName'),
        marital_status = el.tag('maritalStatusCode').attr('displayName');
    
    el = patient.tag('addr');
    var street = el.tag('streetAddressLine').val(),
        city = el.tag('city').val(),
        state = el.tag('state').val(),
        zip = el.tag('postalCode').val(),
        country = el.tag('country').val();
    
    el = patient.tag('telecom');
    var home = el.attr('value'),
        work = null,
        mobile = null;
    
    email = null;
    
    var race = patient.tag('raceCode').attr('displayName'),
        ethnicity = patient.tag('ethnicGroupCode').attr('displayName'),
        religion = patient.tag('religiousAffiliationCode').attr('displayName'),
    
    el = patient.tag('birthplace');
    var birthplace_state = el.tag('state').val(),
        birthplace_zip = el.tag('postalCode').val(),
        birthplace_country = el.tag('country').val();
    
    el = patient.tag('guardian');
    var guardian_relationship = el.tag('code').attr('displayName'),
        guardian_home = el.tag('telecom').attr('value');
    el = el.tag('guardianPerson');
    var guardian_given = el.tag('given').val(),
        guardian_family = el.tag('family').val(),
    
    el = patient.tag('guardian').tag('addr');
    var guardian_street = el.tag('streetAddressLine').val(),
        guardian_city = el.tag('city').val(),
        guardian_state = el.tag('state').val(),
        guardian_zip = el.tag('postalCode').val(),
        guardian_country = el.tag('country').val();
    
    el = patient.tag('providerOrganization');
    var provider_organization = el.tag('name').val(),
        provider_phone = el.tag('telecom').attr('value'),
        provider_street = el.tag('streetAddressLine').val(),
        provider_city = el.tag('city').val(),
        provider_state = el.tag('state').val(),
        provider_zip = el.tag('postalCode').val(),
        provider_country = el.tag('country').val();
    
    // Data object
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
          family:  guardian_family
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
  
  return {
    process: process
  };

}();
