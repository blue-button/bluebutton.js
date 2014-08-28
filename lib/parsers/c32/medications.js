/*
 * Parser for the C32 medications section
 */

Parsers.C32.medications = function (c32) {
  
  var parseDate = Documents.parseDate;
  var data = [], el;
  
  var medications = c32.section('medications');
  
  medications.entries().each(function(entry) {

    var text = null;
    el = entry.tag('substanceAdministration').immediateChildTag('text');
    if (!el.isEmpty()) {
      // technically C32s don't use this, but C83s (another CCD) do,
      // and CCDAs do, so we may see it anyways
      text = Core.stripWhitespace(el.val());
    }

    var effectiveTimes = entry.elsByTag('effectiveTime');

    el = effectiveTimes[0]; // the first effectiveTime is the med start date
    var start_date = null, end_date = null;
    if (el) {
      start_date = parseDate(el.tag('low').attr('value'));
      end_date = parseDate(el.tag('high').attr('value'));
    }

    // the second effectiveTime might the schedule period or it might just
    // be a random effectiveTime from further in the entry... xsi:type should tell us
    el = effectiveTimes[1];
    var schedule_type = null, schedule_period_value = null, schedule_period_unit = null;
    if (el && el.attr('xsi:type') === 'PIVL_TS') {
      var institutionSpecified = el.attr('institutionSpecified');
      if (institutionSpecified === 'true') {
        schedule_type= 'frequency';
      } else if (institutionSpecified === 'false') {
        schedule_type = 'interval';
      }

      el = el.tag('period');
      schedule_period_value = el.attr('value');
      schedule_period_unit = el.attr('unit');
    }
    
    el = entry.tag('manufacturedProduct').tag('code');
    var product_name = el.attr('displayName'),
        product_code = el.attr('code'),
        product_code_system = el.attr('codeSystem');

    if (!product_name) {
      el = entry.tag('manufacturedProduct').tag('originalText');
      if (!el.isEmpty()) {
        product_name = Core.stripWhitespace(el.val());
      }
    }

    // irregularity in some c32s
    if (!product_name) {
      el = entry.tag('manufacturedProduct').tag('name');
      if (!el.isEmpty()) {
        product_name = Core.stripWhitespace(el.val());
      }
    }
    
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
    
    el = entry.template('2.16.840.1.113883.10.20.1.28').tag('value');
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
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      text: text,
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
      schedule: {
        type: schedule_type,
        period_value: schedule_period_value,
        period_unit: schedule_period_unit
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
  
  return data;
};
