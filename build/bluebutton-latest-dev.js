/**
 * BlueButton.js
 */

// v.0.0.6

var Core = function() {
  var ElementWrapper = function(el) {
    return{el:el, template:Core.template, tag:Core.tag, elsByTag:Core.elsByTag, attr:Core.attr, val:Core.val}
  };
  var parseXML = function(data) {
    if(!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null
    }
    var xml, tmp;
    if(window.DOMParser) {
      parser = new DOMParser;
      xml = parser.parseFromString(data, "text/xml")
    }else {
      try {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(data)
      }catch(e) {
        console.log("BB ActiveX Exception: Could not parse XML")
      }
    }
    if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null
    }
    return wrapElement(xml)
  };
  var wrapElement = function(el) {
    if(el.length) {
      var els = [];
      for(var i = 0;i < el.length;i++) {
        els.push(ElementWrapper(el[i]))
      }
      return els
    }else {
      return ElementWrapper(el)
    }
  };
  var emptyEl = function() {
    var el = document.createElement("empty");
    return wrapElement(el)
  };
  var tagAttrVal = function(el, tag, attr, value) {
    el = el.getElementsByTagName(tag);
    for(var i = 0;i < el.length;i++) {
      if(el[i].getAttribute(attr) === value) {
        return el[i]
      }
    }
  };
  var template = function(templateId) {
    var el = tagAttrVal(this.el, "templateId", "root", templateId);
    if(!el) {
      return emptyEl()
    }else {
      return wrapElement(el.parentNode)
    }
  };
  var tag = function(tag) {
    var el = this.el.getElementsByTagName(tag)[0];
    if(!el) {
      return emptyEl()
    }else {
      return wrapElement(el)
    }
  };
  var elsByTag = function(tag) {
    return wrapElement(this.el.getElementsByTagName(tag))
  };
  var attr = function(attr) {
    if(!this.el) {
      return null
    }
    return this.el.getAttribute(attr)
  };
  var val = function() {
    if(!this.el) {
      return null
    }
    try {
      return this.el.childNodes[0].nodeValue
    }catch(e) {
      return null
    }
  };
  var parseDate = function(str) {
    if(!str || typeof str !== "string") {
      console.log("Error: date is not a string");
      return null
    }
    var year = str.substr(0, 4);
    var month = str.substr(4, 2);
    var day = str.substr(6, 2);
    return new Date(year, month, day)
  };
  return{parseXML:parseXML, wrapElement:wrapElement, template:template, tag:tag, elsByTag:elsByTag, attr:attr, val:val, parseDate:parseDate}
}();
var Allergies = function() {
  var parseDate = Core.parseDate;
  var process = function(xmlDOM, type) {
    var data;
    switch(type) {
      case "ccda":
        data = parseCCDA(xmlDOM);
        break;
      case "va_c32":
        data = parseVAC32(xmlDOM);
        break
    }
    return data
  };
  var parseCCDA = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template("2.16.840.1.113883.10.20.22.2.6.1");
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
  var parseVAC32 = function(xmlDOM) {
    var data = [], el, entries, entry;
    el = xmlDOM.template("2.16.840.1.113883.3.88.11.83.102");
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.template("2.16.840.1.113883.10.20.22.4.7").tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.22.4.7").tag("value");
      var reaction_type_name = el.attr("displayName"), reaction_type_code = el.attr("code"), reaction_type_code_system = el.attr("codeSystem"), reaction_type_code_system_name = el.attr("codeSystemName");
      el = entry.template("2.16.840.1.113883.10.20.1.54").tag("value");
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
  var process = function(xmlDOM, type) {
    var data;
    switch(type) {
      case "ccda":
        data = parseCCDA(xmlDOM);
        break;
      case "va_c32":
        data = parseVAC32(xmlDOM);
        break
    }
    return{name:{prefix:data.prefix, given:data.given, family:data.family}, dob:data.dob, gender:data.gender, marital_status:data.marital_status, address:{street:data.street, city:data.city, state:data.state, zip:data.zip, country:data.country}, phone:{home:data.home, work:data.work, mobile:data.mobile}, email:data.email, race:data.race, ethnicity:data.ethnicity, religion:data.religion, birthplace:{state:data.birthplace_state, zip:data.birthplace_zip, country:data.birthplace_country}, guardian:{name:{given:data.guardian_given, 
    family:data.guardian_family}, relationship:data.guardian_relationship, address:{street:data.guardian_street, city:data.guardian_city, state:data.guardian_state, zip:data.guardian_zip, country:data.guardian_country}, phone:{home:data.guardian_home}}, provider:{organization:data.provider_organization, phone:data.provider_phone, address:{street:data.provider_street, city:data.provider_city, state:data.provider_state, zip:data.provider_zip, country:data.provider_country}}}
  };
  var parseCCDA = function(xmlDOM) {
    var data = {}, el, patient;
    el = xmlDOM.template("2.16.840.1.113883.10.20.22.1.1");
    patient = el.tag("patientRole");
    el = patient.tag("patient").tag("name");
    data.prefix = el.tag("prefix").val(), data.given = el.tag("given").val(), data.family = el.tag("family").val();
    el = patient.tag("patient");
    data.dob = parseDate(el.tag("birthTime").attr("value")), data.gender = el.tag("administrativeGenderCode").attr("displayName"), data.marital_status = el.tag("maritalStatusCode").attr("displayName");
    el = patient.tag("addr");
    data.street = el.tag("streetAddressLine").val(), data.city = el.tag("city").val(), data.state = el.tag("state").val(), data.zip = el.tag("postalCode").val(), data.country = el.tag("country").val();
    el = patient.tag("telecom");
    data.home = el.attr("value"), data.work = null, data.mobile = null;
    data.email = null;
    data.race = patient.tag("raceCode").attr("displayName"), data.ethnicity = patient.tag("ethnicGroupCode").attr("displayName"), data.religion = patient.tag("religiousAffiliationCode").attr("displayName"), el = patient.tag("birthplace");
    data.birthplace_state = el.tag("state").val(), data.birthplace_zip = el.tag("postalCode").val(), data.birthplace_country = el.tag("country").val();
    el = patient.tag("guardian");
    data.guardian_relationship = el.tag("code").attr("displayName"), data.guardian_home = el.tag("telecom").attr("value");
    el = el.tag("guardianPerson");
    data.guardian_given = el.tag("given").val(), data.guardian_family = el.tag("family").val(), el = patient.tag("guardian").tag("addr");
    data.guardian_street = el.tag("streetAddressLine").val(), data.guardian_city = el.tag("city").val(), data.guardian_state = el.tag("state").val(), data.guardian_zip = el.tag("postalCode").val(), data.guardian_country = el.tag("country").val();
    el = patient.tag("providerOrganization");
    data.provider_organization = el.tag("name").val(), data.provider_phone = el.tag("telecom").attr("value"), data.provider_street = el.tag("streetAddressLine").val(), data.provider_city = el.tag("city").val(), data.provider_state = el.tag("state").val(), data.provider_zip = el.tag("postalCode").val(), data.provider_country = el.tag("country").val();
    return data
  };
  var parseVAC32 = function(xmlDOM) {
    var C32SectionTemplateID = "1.3.6.1.4.1.19376.1.5.3.1.1.1"
  };
  return{process:process}
}();
var Encounters = function() {
  var parseDate = Core.parseDate;
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.22.1";
  var C32SectionTemplateID = "2.16.840.1.113883.10.20.1.3";
  var process = function(xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      var date = parseDate(entry.tag("effectiveTime").attr("value"));
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
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.2";
  var C32SectionTemplateID = "2.16.840.1.113883.10.20.1.6";
  var process = function(xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
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
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.3.1";
  var C32SectionTemplateID = "2.16.840.1.113883.10.20.1.14";
  var process = function(xmlDOM, type) {
    var data = [], results_data = [], el, entries, entry, results, result, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("code");
      var name = el.attr("displayName"), code = el.attr("code"), code_system = el.attr("codeSystem"), code_system_name = el.attr("codeSystemName");
      results = entry.elsByTag("component");
      for(var j = 0;j < results.length;j++) {
        result = results[j];
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
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.1.1";
  var C32SectionTemplateID = "2.16.840.1.113883.3.88.11.83.112";
  var process = function(xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var low = parseDate(el.tag("low").attr("value")), high = parseDate(el.tag("high").attr("value"));
      el = entry.tag("manufacturedProduct").tag("code");
      var product_name = el.attr("displayName"), product_code = el.attr("code"), product_code_system = el.attr("codeSystem");
      el = entry.tag("manufacturedProduct").tag("translation");
      var translation_name = el.attr("displayName"), translation_code = el.attr("code"), translation_code_system = el.attr("codeSystem"), translation_code_system_name = el.attr("codeSystemName");
      el = entry.tag("doseQuantity");
      var dose_value = el.attr("value"), dose_unit = el.attr("unit");
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
      data.push({effective_time:{low:low, high:high}, product:{name:product_name, code:product_code, code_system:product_code_system, translation:{name:translation_name, code:translation_code, code_system:translation_code_system, code_system_name:translation_code_system_name}}, dose_quantity:{value:dose_value, unit:dose_unit}, rate_quantity:{value:rate_quantity_value, unit:rate_quantity_unit}, precondition:{name:precondition_name, code:precondition_code, code_system:precondition_code_system}, reason:{name:reason_name, 
      code:reason_code, code_system:reason_code_system}, route:{name:route_name, code:route_code, code_system:route_code_system, code_system_name:route_code_system_name}, vehicle:{name:vehicle_name, code:vehicle_code, code_system:vehicle_code_system, code_system_name:vehicle_code_system_name}, administration:{name:administration_name, code:administration_code, code_system:administration_code_system, code_system_name:administration_code_system_name}, prescriber:{organization:prescriber_organization, 
      person:prescriber_person}})
    }
    return data
  };
  return{process:process}
}();
var Problems = function() {
  var parseDate = Core.parseDate;
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.5";
  var C32SectionTemplateID = "2.16.840.1.113883.10.20.1.11";
  var process = function(xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var from = parseDate(el.tag("low").attr("value")), to = parseDate(el.tag("high").attr("value"));
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
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.7";
  var C32SectionTemplateID = "2.16.840.1.113883.10.20.1.12";
  var process = function(xmlDOM, type) {
    var data = [], el, entries, entry, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var date = parseDate(el.attr("value"));
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
  var CCDASectionTemplateID = "2.16.840.1.113883.10.20.22.2.4.1";
  var C32SectionTemplateID = "2.16.840.1.113883.10.20.1.16";
  var process = function(xmlDOM, type) {
    var data = [], results_data = [], el, entries, entry, results, result, templateID;
    if(type == "ccda") {
      templateID = CCDASectionTemplateID
    }else {
      templateID = C32SectionTemplateID
    }
    el = xmlDOM.template(templateID);
    entries = el.elsByTag("entry");
    for(var i = 0;i < entries.length;i++) {
      entry = entries[i];
      el = entry.tag("effectiveTime");
      var date = parseDate(el.attr("value"));
      results = entry.elsByTag("component");
      for(var j = 0;j < results.length;j++) {
        result = results[j];
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
var BlueButton = function(source) {
  var xmlDOM = null, type, data = {};
  var addMethods = function(objects) {
    for(var i = 0;i < objects.length;i++) {
      objects[i].json = function() {
        return JSON.stringify(this, null, 2)
      }
    }
  };
  var doc = function() {
    return data.document
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
  var problems = function() {
    return data.problems
  };
  var procedures = function() {
    return data.procedures
  };
  var vitals = function() {
    return data.vitals
  };
  source = source.replace(/^\s+|\s+$/g, "");
  if(source.substr(0, 5) == "<?xml") {
    xmlDOM = Core.parseXML(source);
    if(xmlDOM.template("1.3.6.1.4.1.19376.1.5.3.1.1.1").el.tagName.toLowerCase() == "empty") {
      type = "ccda"
    }else {
      type = "va_c32"
    }
    data.document = {type:type};
    data.allergies = Allergies.process(xmlDOM, type);
    data.demographics = Demographics.process(xmlDOM, type);
    data.encounters = Encounters.process(xmlDOM, type);
    data.immunizations = Immunizations.process(xmlDOM, type);
    data.labs = Labs.process(xmlDOM, type);
    data.medications = Medications.process(xmlDOM, type);
    data.problems = Problems.process(xmlDOM, type);
    data.procedures = Procedures.process(xmlDOM, type);
    data.vitals = Vitals.process(xmlDOM, type);
    addMethods([data, data.document, data.allergies, data.demographics, data.encounters, data.immunizations, data.labs, data.medications, data.problems, data.procedures, data.vitals])
  }else {
    data = JSON.parse(source)
  }
  return{data:data, xmlDOM:xmlDOM, document:doc, allergies:allergies, demographics:demographics, encounters:encounters, immunizations:immunizations, labs:labs, medications:medications, problems:problems, procedures:procedures, vitals:vitals}
};
window.BlueButton = BlueButton;

