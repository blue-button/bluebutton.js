/**
 * BlueButton.js
 */

// v.0.0.2

var Core = function() {
  var parseXML = function(data) {
    if(!data || typeof data !== "string") {
      console.log("Error: XML data is not a string");
      return null
    }
    var xml, tmp;
    if(window.DOMParser) {
      parser = new DOMParser;
      xml = parser.parseFromString(data, "text/xml")
    }else {
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(data)
    }
    return xml
  };
  var tagAttrVal = function(xmlDOM, tag, attr, value) {
    var el = xmlDOM.getElementsByTagName(tag);
    for(var i = 0;i < el.length;i++) {
      if(el[i].getAttribute(attr) === value) {
        return el[i]
      }
    }
  };
  var template = function(templateId) {
    var el = tagAttrVal(this, "templateId", "root", templateId);
    return el.parentElement
  };
  var tag = function(tag) {
    return this.getElementsByTagName(tag)[0]
  };
  var elsByTag = function(tag) {
    return this.getElementsByTagName(tag)
  };
  var attr = function(attr) {
    return this.getAttribute(attr)
  };
  var val = function() {
    return this.childNodes[0].nodeValue
  };
  var parseDate = function(str) {
    var year = str.substr(0, 4);
    var month = str.substr(4, 2);
    var day = str.substr(6, 2);
    return new Date(year, month, day)
  };
  return{parseXML:parseXML, tagAttrVal:tagAttrVal, template:template, tag:tag, elsByTag:elsByTag, attr:attr, val:val, parseDate:parseDate}
}();
var Allergies = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.6.1";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.template("2.16.840.1.113883.10.20.22.4.7").tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.7").tag("value");
      var reaction_type_name = el.attr("displayName"), reaction_type_code = el.attr("code"), reaction_type_code_system = el.attr("codeSystem"), reaction_type_code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.9").tag("value");
      var reaction_name = el.attr("displayName"), reaction_code = el.attr("code"), reaction_code_system = el.attr("codeSystem");
      el = entry.template("2.16.840.1.113883.10.20.22.4.8").tag("value");
      var severity = el.attr("displayName");
      el = entry.tag("participant").tag("code");
      var allergen_name = el.attr("displayName"), allergen_code = el.attr("code"), allergen_code_system = el.attr("codeSystem"), allergen_code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.28").tag("value");
      var status = el.attr("displayName");
      data.push({date:{value:null, low:null, high:null}, observation_date:{low:null}, name:name, code:code, code_system:code_system, code_system_name:code_system_name, status:status, severity:severity, reaction:{date:{low:null}, name:reaction_name, code:reaction_code, code_system:reaction_code_system}, reaction_type:{name:reaction_type_name, code:reaction_type_code, code_system:reaction_code_system, code_system_name:reaction_type_code_system_name}, allergen:{name:allergen_name, code:allergen_code, 
      code_system:allergen_code_system, code_system_name:allergen_code_system_name}})
    }
    return data
  };
  return{process:process}
}();
var Demographics = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.1.1";
  var process = function(xmlDOM) {
    var data, el, patient;
    el = xmlDOM.template(sectionTemplateID);
    patient = el.tag("patientRole");
    el = patient.tag("patient").tag("name");
    var prefix = el.tag("prefix").val(), given = el.tag("given").val(), family = el.tag("family").val();
    el = patient.tag("patient");
    var dob = el.tag("birthTime").attr("value"), gender = el.tag("administrativeGenderCode").attr("displayName"), marital_status = el.tag("maritalStatusCode").attr("displayName");
    el = patient.tag("addr");
    var street = el.tag("streetAddressLine").val(), city = el.tag("city").val(), state = el.tag("state").val(), zip = el.tag("postalCode").val(), country = el.tag("country").val();
    el = patient.tag("telecom");
    var home = el.attr("value"), work = null, mobile = null;
    email = null;
    var race = patient.tag("raceCode").attr("displayName"), ethnicity = patient.tag("ethnicGroupCode").attr("displayName"), religion = patient.tag("religiousAffiliationCode").attr("displayName"), el = patient.tag("birthplace");
    var birthplace_state = el.tag("state").val(), birthplace_zip = el.tag("postalCode").val(), birthplace_country = el.tag("country").val();
    el = patient.tag("guardian");
    var guardian_relationship = el.tag("code").attr("displayName"), guardian_home = el.tag("telecom").attr("value");
    el = el.tag("guardianPerson");
    var guardian_given = el.tag("given").val(), guardian_family = el.tag("family").val(), el = patient.tag("guardian").tag("addr");
    var guardian_street = el.tag("streetAddressLine").val(), guardian_city = el.tag("city").val(), guardian_state = el.tag("state").val(), guardian_zip = el.tag("postalCode").val(), guardian_country = el.tag("country").val();
    el = patient.tag("providerOrganization");
    var provider_organization = el.tag("name").val(), provider_phone = el.tag("telecom").attr("value"), provider_street = el.tag("streetAddressLine").val(), provider_city = el.tag("city").val(), provider_state = el.tag("state").val(), provider_zip = el.tag("postalCode").val(), provider_country = el.tag("country").val();
    data = {name:{prefix:prefix, given:given, family:family}, dob:dob, gender:gender, marital_status:marital_status, address:{street:street, city:city, state:state, zip:zip, country:country}, phone:{home:home, work:work, mobile:mobile}, email:email, race:race, ethnicity:ethnicity, religion:religion, birthplace:{state:birthplace_state, zip:birthplace_zip, country:birthplace_country}, guardian:{name:{given:guardian_given, family:guardian_family}, relationship:guardian_relationship, address:{street:guardian_street, 
    city:guardian_city, state:guardian_state, zip:guardian_zip, country:guardian_country}, phone:{home:guardian_home}}, provider:{organization:provider_organization, phone:provider_phone, address:{street:provider_street, city:provider_city, state:provider_state, zip:provider_zip, country:provider_country}}};
    return data
  };
  return{process:process}
}();
var Encounters = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.22.1";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      var date = entry.tag("effectiveTime").attr("value");
      el = entry.tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName"), code_system_version = el.attr("codeSystemVersion");
      el = entry.tag("value");
      var finding_name = el.attr("displayName"), finding_code = el.attr("code"), finding_code_system = el.attr("codeSystem");
      el = entry.tag("translation");
      var translation_name = el.attr("displayName"), translation_code = el.attr("code"), translation_code_system = el.attr("codeSystem"), translation_code_system_name = el.attr("codeSystemName");
      el = entry.tag("performer").tag("code");
      var performer_name = el.attr("displayName"), performer_code = el.attr("code"), performer_code_system = el.attr("codeSystem"), performer_code_system_name = el.attr("codeSystemName");
      el = entry.tag("participant");
      var organization = el.tag("code").attr("displayName"), street = el.tag("streetAddressLine").val(), city = el.tag("city").val(), state = el.tag("state").val(), zip = el.tag("postalCode").val(), country = el.tag("country").val();
      data.push({date:date, name:name, code:code, code_system:code_system, code_system_name:code_system_name, code_system_version:code_system_version, finding:{name:finding_name, code:finding_code, code_system:finding_code_system}, translation:{name:translation_name, code:translation_code, code_system:translation_code_system, code_system_name:translation_code_system_name}, performer:{name:performer_name, code:performer_code, code_system:performer_code_system, code_system_name:performer_code_system_name}, 
      location:{organization:organization, street:street, city:city, state:state, zip:zip, country:country}})
    }
    return data
  };
  return{process:process}
}();
var Immunizations = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.2";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var date = parseDate(el.attr("value"));
      el = entry.template("2.16.840.1.113883.10.20.22.4.54").tag("code");
      var product_name = el.attr("displayName"), product_code = el.attr("code"), product_code_system = el.attr("codeSystem"), product_code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.54").tag("translation");
      var translation_name = el.attr("displayName"), translation_code = el.attr("code"), translation_code_system = el.attr("codeSystem"), translation_code_system_name = el.attr("codeSystemName");
      el = entry.tag("routeCode");
      var route_name = el.attr("displayName"), route_code = el.attr("code"), route_code_system = el.attr("codeSystem"), route_code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.20");
      var instructions_text = el.tag("text").val();
      el = el.tag("code");
      var education_name = el.attr("displayName"), education_code = el.attr("code"), education_code_system = el.attr("codeSystem");
      data.push({date:date, product:{name:product_name, code:product_code, code_system:product_code_system, code_system_name:product_code_system_name, translation:{name:translation_name, code:translation_code, code_system:translation_code_system, code_system_name:translation_code_system_name}}, route:{name:route_name, code:route_code, code_system:route_code_system, code_system_name:route_code_system_name}, instructions:instructions_text, education_type:{name:education_name, code:education_code, code_system:education_code_system}})
    }
    return data
  };
  return{process:process}
}();
var Labs = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.3.1";
  var process = function(xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName");
      results = entry.elsByTag("component");
      for(var i = 0;i < results.length;i++) {
        result = results[i];
        var date = parseDate(result.tag("effectiveTime").attr("value"));
        el = result.tag("code");
        var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName");
        el = result.tag("value");
        var value = el.attr("value"), unit = el.attr("unit");
        reference_low = null;
        reference_high = null;
        results_data.push({date:date, name:name, value:value, unit:unit, code:code, code_system:code_system, code_system_name:code_system_name, reference:{low:reference_low, high:reference_high}})
      }
      data.push({name:name, code:code, code_system:code_system, code_system_name:code_system_name, results:results_data})
    }
    return data
  };
  return{process:process}
}();
var Medications = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.1.1";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var low = parseDate(el.tag("low").attr("value")), high = parseDate(el.tag("high").attr("value"));
      el = entry.tag("manufacturedProduct").tag("code");
      var product_name = el.attr("displayName"), product_code = el.attr("code"), product_code_system = el.attr("codeSystem");
      el = entry.tag("manufacturedProduct").tag("translation");
      var translation_name = el.attr("displayName"), translation_code = el.attr("code"), translation_code_system = el.attr("codeSystem"), translation_code_system_name = el.attr("codeSystemName");
      var dose_quantity = entry.tag("doseQuantity").attr("value");
      el = entry.tag("rateQuantity");
      var rate_quantity_value = el.attr("value"), rate_quantity_unit = el.attr("unit");
      el = entry.tag("precondition").tag("value");
      var precondition_name = el.attr("displayName"), precondition_code = el.attr("code"), precondition_code_system = el.attr("codeSystem"), el = entry.template("2.16.840.1.113883.10.20.22.4.19").tag("value");
      var reason_name = el.attr("displayName"), reason_code = el.attr("code"), reason_code_system = el.attr("codeSystem");
      el = entry.tag("routeCode");
      var route_name = el.attr("displayName"), route_code = el.attr("code"), route_code_system = el.attr("codeSystem"), route_code_system_name = el.attr("codeSystemName");
      el = entry.tag("participant").tag("code");
      var vehicle_name = el.attr("displayName"), vehicle_code = el.attr("code"), vehicle_code_system = el.attr("codeSystem"), vehicle_code_system_name = el.attr("codeSystemName");
      el = entry.tag("administrationUnitCode");
      var administration_name = el.attr("displayName"), administration_code = el.attr("code"), administration_code_system = el.attr("codeSystem"), administration_code_system_name = el.attr("codeSystemName");
      el = entry.tag("performer");
      var prescriber_organization = el.tag("name").val(), prescriber_person = null;
      data.push({effective_time:{low:low, high:high}, product:{name:product_name, code:product_code, code_system:product_code_system, translation:{name:translation_name, code:translation_code, code_system:translation_code_system, code_system_name:translation_code_system_name}}, dose_quantity:dose_quantity, rate_quantity:{value:rate_quantity_value, unit:rate_quantity_unit}, precondition:{name:precondition_name, code:precondition_code, code_system:precondition_code_system}, reason:{name:reason_name, 
      code:reason_code, code_system:reason_code_system}, route:{name:route_name, code:route_code, code_system:route_code_system, code_system_name:route_code_system_name}, vehicle:{name:vehicle_name, code:vehicle_code, code_system:vehicle_code_system, code_system_name:vehicle_code_system_name}, administration:{name:administration_name, code:administration_code, code_system:administration_code_system, code_system_name:administration_code_system_name}, prescriber:{organization:prescriber_organization, 
      person:prescriber_person}})
    }
    return data
  };
  return{process:process}
}();
var Plan = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.10";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      var date = null, name = null, code = null, code_system = null;
      data.push({date:date, name:name, code:code, code_system:code_system})
    }
    return data
  };
  return{process:process}
}();
var Problems = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.5";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var from = el.tag("low").attr("value"), to = el.tag("high").attr("value");
      el = entry.template("2.16.840.1.113883.10.20.22.4.4").tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem");
      el = entry.template("2.16.840.1.113883.10.20.22.4.6");
      var status = el.tag("value").attr("displayName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.31");
      var age = parseInt(el.tag("value").attr("value"));
      data.push({date:{from:from, to:to}, name:name, status:status, age:age, code:code, code_system:code_system})
    }
    return data
  };
  return{process:process}
}();
var Procedures = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.7";
  var process = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var date = el.attr("value");
      el = entry.tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem");
      specimen_name = null;
      specimen_code = null;
      specimen_code_system = null;
      el = entry.tag("performer");
      var organization = el.tag("name").val(), phone = el.tag("telecom").attr("value"), street = el.tag("streetAddressLine").val(), city = el.tag("city").val(), state = el.tag("state").val(), zip = el.tag("postalCode").val(), country = el.tag("country").val();
      el = entry.tag("participant").tag("code");
      var device_name = el.attr("displayName"), device_code = el.attr("code"), device_code_system = el.attr("codeSystem");
      data.push({date:date, name:name, code:code, code_system:code_system, specimen:{name:specimen_name, code:specimen_code, code_system:specimen_code_system}, performer:{organization:organization, street:street, city:city, state:state, zip:zip, country:country, phone:phone}, device:{name:device_name, code:device_code, code_system:device_code_system}})
    }
    return data
  };
  return{process:process}
}();
var Vitals = function() {
  var parseDate = Core.parseDate;
  var sectionTemplateID = "2.16.840.1.113883.10.20.22.2.4.1";
  var process = function(xmlDOM) {
    var data = [], results_data = [], el, entries, entry, results, result;
    el = xmlDOM.template(sectionTemplateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var date = parseDate(el.attr("value"));
      results = entry.elsByTag("component");
      for(var i = 0;i < results.length;i++) {
        result = results[i];
        el = result.tag("code");
        var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName");
        el = result.tag("value");
        var value = el.attr("value"), unit = el.attr("unit");
        results_data.push({name:name, code:code, code_system:code_system, code_system_name:code_system_name, value:value, unit:unit})
      }
      data.push({date:date, results:results_data})
    }
    return data
  };
  return{process:process}
}();
var BlueButton = function(xml) {
  var xmlDOM = null, data = {};
  var addMethods = function(objects) {
    for(var i = 0;i < objects.length;i++) {
      objects[i].json = function() {
        return JSON.stringify(this, null, 2)
      }
    }
  };
  var allergies = function() {
    return data.allergies
  };
  var demographics = function() {
    return data.demographics
  };
  var encounters = function() {
    return data.encounters
  };
  var immunizations = function() {
    return data.immunizations
  };
  var labs = function() {
    return data.labs
  };
  var medications = function() {
    return data.medications
  };
  var plan = function() {
    return data.plan
  };
  var problems = function() {
    return data.problems
  };
  var procedures = function() {
    return data.procedures
  };
  var vitals = function() {
    return data.vitals
  };
  xmlDOM = Core.parseXML(xml);
  var els = xmlDOM.getElementsByTagName("*");
  for(var i = 0;i < els.length;i++) {
    els[i].template = Core.template;
    els[i].tag = Core.tag;
    els[i].elsByTag = Core.elsByTag;
    els[i].attr = Core.attr;
    els[i].val = Core.val
  }
  xmlDOM.template = Core.template;
  data.allergies = Allergies.process(xmlDOM);
  data.demographics = Demographics.process(xmlDOM);
  data.encounters = Encounters.process(xmlDOM);
  data.immunizations = Immunizations.process(xmlDOM);
  data.labs = Labs.process(xmlDOM);
  data.medications = Medications.process(xmlDOM);
  data.plan = Plan.process(xmlDOM);
  data.problems = Problems.process(xmlDOM);
  data.procedures = Procedures.process(xmlDOM);
  data.vitals = Vitals.process(xmlDOM);
  addMethods([data.allergies, data.demographics, data.encounters, data.immunizations, data.labs, data.medications, data.plan, data.problems, data.procedures, data.vitals]);
  return{data:data, xmlDOM:xmlDOM, allergies:allergies, demographics:demographics, encounters:encounters, immunizations:immunizations, labs:labs, medications:medications, plan:plan, problems:problems, procedures:procedures, vitals:vitals}
};
window.BlueButton = BlueButton;

