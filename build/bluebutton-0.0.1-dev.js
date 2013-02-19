/**
 * BlueButton.js
 */

// v.0.0.1

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
  var getElementByTagAttrValue = function(xmlDOM, tag, attr, value) {
    var el = xmlDOM.getElementsByTagName(tag);
    for(var i = 0;i < el.length;i++) {
      if(el[i].getAttribute(attr) === value) {
        return el[i]
      }
    }
  };
  var getSection = function(xmlDOM, templateId) {
    return getElementByTagAttrValue(xmlDOM, "templateId", "root", templateId)
  };
  return{parseXML:parseXML, getElementByTagAttrValue:getElementByTagAttrValue, getSection:getSection}
}();
var Allergies = function() {
  var templateId = "";
  var process = function(xmlDOM) {
    var data = [];
    data.push({date:{value:"20090909", low:"20090902", high:"20100103"}, observation_date:{low:"20110215"}, name:"drug allergy", code:"416098002", code_system:"2.16.840.1.113883.6.96", code_system_name:"SNOMED CT", reaction_type:{name:"Adverse reaction to substance", code:"282100009", code_system:"2.16.840.1.113883.6.96", code_system_name:"SNOMED CT"}, allergen:{name:"ALLERGENIC EXTRACT, PENICILLIN", code:"314422", code_system:"2.16.840.1.113883.6.88", code_system_name:"RxNorm"}, status:"active", 
    reaction:{date:{low:"20090711"}, name:"Hives", code:"247472004", code_system:"2.16.840.1.113883.6.96"}, severity:"moderate to severe"});
    return data
  };
  return{process:process}
}();
var Demographics = function() {
  var templateId = "";
  var process = function(xmlDOM) {
    var data = [];
    data.push({name:{prefix:"Mr.", given:["Adam", "Frankie"], family:"Everyman"}, dob:"1954-11-25", gender:"male", marital_status:"married", address:{street:["17 Daws Rd.", "Apt 102"], city:"Blue Bell", state:"MA", country:"US", zip:"02368"}, phone:{home:["555-555-1212"], work:["555-555-2323"], mobile:["555-555-3434", "555-555-4545"]}, email:"adam@email.com", race:"white", ethnicity:"Not Hispanic or Latino", religion:"Christian (non-Catholic, non-specific)", guardian:{name:{given:["Ralph", "Frankie"], 
    family:"Relative"}, relationship:"Grandfather", address:{street:["17 Daws Rd.", "Apt 102"], city:"Blue Bell", state:"MA", country:"US", zip:"02368"}, phone:{home:"781-555-1212"}}, birthplace:{state:"MA", zip:"02368", country:"US"}, provider:{organization:"Good Health Clinic", phone:"781-555-1212", address:{street:["21 North Ave"], city:"Burlington", state:"MA", zip:"02368", country:"US"}}});
    return data
  };
  return{process:process}
}();
var Encounters = function() {
  var templateId = "";
  var process = function(xmlDOM) {
    var data = [];
    data.push({date:"20000407", name:"Office consultation - 15 minutes", finding:{name:"Bronchitis", code:"32398004", code_system:"2.16.840.1.113883.6.96"}, code:"99241", code_system:"2.16.840.1.113883.6.12", code_system_name:"CPT", code_system_version:4, translation:{name:"Ambulatory", code:"AMB", code_system:"2.16.840.1.113883.5.4", code_system_name:"HL7 ActEncounterCode"}, performer:{name:"General Physician", code:"59058001", code_system:"2.16.840.1.113883.6.96", code_system_name:"SNOMED CT"}, 
    location:{organization:"Good Health Clinic", street:["17 Daws Rd."], city:"Blue Bell", state:"MA", zip:"02368", country:"US", name:"General Acute Care Hospital", code:"GACH", code_system:"2.16.840.1.113883.5.111", code_system_name:"HL7 RoleCode"}});
    return data
  };
  return{process:process}
}();
var Immunizations = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.2";
  var process = function(xmlDOM) {
    var data = [], entries, el;
    el = Core.getSection(xmlDOM, templateId);
    entries = el.parentElement.getElementsByTagName("entry");
    for(var i = 0;i < entries.length;i++) {
      el = entries[i].getElementsByTagName("effectiveTime")[0];
      var date = el.getAttribute("value");
      el = entries[i].getElementsByTagName("consumable")[0];
      el = el.getElementsByTagName("code")[0];
      var product_name = el.getAttribute("displayName");
      var product_code = el.getAttribute("code");
      var product_code_system = el.getAttribute("codeSystem");
      var product_code_system_name = el.getAttribute("codeSystemName");
      el = entries[i].getElementsByTagName("routeCode")[0];
      var route_name = el.getAttribute("displayName");
      var route_code = el.getAttribute("code");
      var route_code_system = el.getAttribute("codeSystem");
      var route_code_system_name = el.getAttribute("codeSystemName");
      el = entries[i].getElementsByTagName("entryRelationship")[0];
      var codeTag = el.getElementsByTagName("code")[0];
      var instructions_text = el.getElementsByTagName("text")[0].childNodes[0].nodeValue;
      var education_name = codeTag.getAttribute("displayName");
      var education_code = codeTag.getAttribute("code");
      var education_code_system = codeTag.getAttribute("codeSystem");
      el = entries[i].getElementsByTagName("translation")[0];
      var translation_name = el.getAttribute("displayName");
      var translation_code = el.getAttribute("code");
      var translation_code_system = el.getAttribute("codeSystem");
      var translation_code_system_name = el.getAttribute("codeSystemName");
      data.push({date:date, product:{name:product_name, code:product_code, code_system:product_code_system, code_system_name:product_code_system_name, translation:{name:translation_name, code:translation_code, code_system:translation_code_system, code_system_name:translation_code_system_name}}, route:{name:route_name, code:route_code, code_system:route_code_system, code_system_name:route_code_system_name}, instructions:instructions_text, education_type:{name:education_name, code:education_code, code_system:education_code_system}})
    }
    return data
  };
  return{process:process}
}();
var Labs = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.3.1";
  var process = function(xmlDOM) {
    var data = [];
    data.push({name:"CBC WO DIFFERENTIAL", code:"43789009", code_system:"2.16.840.1.113883.6.96", code_system_name:"SNOMED CT", results:[{date:"200003231430", name:"WBC", value:6.7, unit:"10+3/ul", code:"33765-9", code_system:"2.16.840.1.113883.6.1", code_system_name:"LOINC", reference:{low:4.3, high:10.8}}]});
    return data
  };
  return{process:process}
}();
var Medications = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.1.1";
  var process = function(xmlDOM) {
    var data = [];
    data.push({effective_time:{low:"20110301", high:"20120301"}, product:{name:"Albuterol 0.09 MG/ACTUAT inhalant solution", code:"329498", code_system:"2.16.840.1.113883.6.88", translation:{name:"Proventil 0.09 MG/ACTUAT inhalant solution", code:"573621", code_system:"2.16.840.1.113883.6.88", code_system_name:"RxNorm"}}, dose_quantity:1, rate_quantity:{value:90, unit:"ml/min"}, precondition:{name:"Wheezing", code:"56018004", code_system:"2.16.840.1.113883.6.96"}, reason:{name:"Bronchitis", code:"32398004", 
    code_system:"2.16.840.1.113883.6.96"}, route:{name:"RESPIRATORY (INHALATION)", code:"C38216", code_system:"2.16.840.1.113883.3.26.1.1", code_system_name:"NCI Thesaurus"}, vehicle:{name:"Diethylene Glycol", code:"5955009", code_system:"2.16.840.1.113883.6.96", code_system_name:"SNOMED CT"}, administration:{name:"INHALANT", code:"C42944", code_system:"2.16.840.1.113883.3.26.1.1", code_system_name:"NCI Thesaurus"}, prescriber:{organization:"Good Health Clinic", person:"Dr. Robert Michaels"}});
    return data
  };
  return{process:process}
}();
var Plan = function() {
  var templateId = "";
  var process = function(xmlDOM) {
    var data = [];
    data.push({date:"20000421", name:"Colonoscopy", code:"310634005", code_system:"2.16.840.1.113883.6.96"});
    return data
  };
  return{process:process}
}();
var Problems = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.5";
  var process = function(xmlDOM) {
    var data = [];
    data.push({date:{from:"199803", to:"199803"}, name:"Pneumonia", status:"Active", age:57, code:"233604007", code_system:"2.16.840.1.113883.6.96"});
    return data
  };
  return{process:process}
}();
var Procedures = function() {
  var templateId = "2.16.840.1.113883.10.20.22.2.7";
  var process = function(xmlDOM) {
    var data = [];
    data.push({date:"20110215", name:"Colonic polypectomy", code:"274025005", code_system:"2.16.840.1.113883.6.96", specimen:{name:"colonic polyp sample", code:"309226005", code_system:"2.16.840.1.113883.6.96"}, performer:{organization:"Good Health Clinic", street:["17 Daws Rd."], city:"Blue Bell", state:"MA", zip:"02368", country:"US", phone:"555-555-1234"}, participant:{name:"Colonoscope", code:"90412006", code_system:"2.16.840.1.113883.6.96"}});
    return data
  };
  return{process:process}
}();
var Vitals = function() {
  var templateId = "";
  var process = function(xmlDOM) {
    var data = [];
    data.push({date:"19991114", results:[{name:"Height", code:"8302-2", code_system:"2.16.840.1.113883.6.1", code_system_name:"LOINC", value:117, unit:"cm"}, {name:"Patient Body Weight - Measured", code:"3141-9", code_system:"2.16.840.1.113883.6.1", code_system_name:"LOINC", value:86, unit:"kg"}, {name:"Intravascular Systolic", code:"8480-6", code_system:"2.16.840.1.113883.6.1", code_system_name:"LOINC", value:132, unit:"mm[Hg]"}]});
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

