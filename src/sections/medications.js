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
