/*
 * demographics.js
 */

C32.Demographics = (function () {
  
  // Dependancies
  ///////////////////////////
  var parseDate = Core.parseDate;
  var parseName = Core.parseName;
  var parseAddress = Core.parseAddress;
  
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
    var data = {}, el, patient;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.32.1');
    patient = el.tag('patientRole');
    el = patient.tag('patient').tag('name');
    var patient_name_dict = parseName(el);
    
    el = patient.tag('patient');
    var dob = parseDate(el.tag('birthTime').attr('value')),
        gender = Codes.gender(el.tag('administrativeGenderCode').attr('code')),
        marital_status = Codes.maritalStatus(el.tag('maritalStatusCode').attr('code'));
    
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
    
    data = {
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
    
    return data;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
})();
