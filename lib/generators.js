/*
 * ...
 */

/* exported Generators */
var Generators = (function () {
  
  var method = function () {};

  /* Import ejs if we're in Node. Then setup custom formatting filters
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      ejs = require("ejs");
    }
  }

  if (ejs) {
    /* Filters are automatically available to ejs to be used like "... | hl7Date"
     * Helpers are functions that we'll manually pass in to ejs.
     * The intended distinction is that a helper gets called with regular function-call syntax
     */
    var pad = function(number) {
      if (number < 10) {
        return '0' + number;
      }
      return String(number);
    };

    ejs.filters.hl7Date = function(obj) {
      try {
          var date = new Date(obj);
          if (isNaN(date.getTime())) { return obj; }

          if (date.getHours() || date.getMinutes() || date.getSeconds()) {
            // If there's a meaningful time, output a UTC datetime
            var dateStr = date.getUTCFullYear() +
              pad( date.getUTCMonth() + 1 ) +
              pad( date.getUTCDate() );
            var timeStr = pad( date.getUTCHours() ) +
              pad( date.getUTCMinutes() ) +
              pad ( date.getUTCSeconds() ) +
              "+0000";
            return dateStr + timeStr;
           
          } else {
            // If there's no time, don't apply timezone tranformations: just output a date
            return String(date.getFullYear()) +
              pad( date.getMonth() + 1 ) +
              pad( date.getDate() );
          }

      } catch (e) {
          return obj;
      }
    };

    var escapeSpecialChars = function(s) {
      return s.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/&/g, '&amp;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
    };

    ejs.filters.hl7Code = function(obj) {
      if (!obj) { return ''; }

      var tag = '';
      var name = obj.name || '';
      if (obj.name) { tag += 'displayName="'+escapeSpecialChars(name)+'"'; }

      if (obj.code) {
        tag += ' code="'+obj.code+'"';
        if (obj.code_system) { tag += ' codeSystem="'+escapeSpecialChars(obj.code_system)+'"'; }
        if (obj.code_system_name) { tag += ' codeSystemName="' +
                                        escapeSpecialChars(obj.code_system_name)+'"'; }
      } else {
        tag += ' nullFlavor="UNK"';
      }

      if (!obj.name && ! obj.code) {
        return 'nullFlavor="UNK"';
      }
      
      return tag;
    };

    ejs.filters.emptyStringIfFalsy = function(obj) {
      if (!obj) { return ''; }
      return obj;
    };

    if (!ejs.helpers) ejs.helpers = {};
    ejs.helpers.simpleTag = function(tagName, value) {
      if (value) {
        return "<"+tagName+">"+value+"</"+tagName+">";
      } else {
        return "<"+tagName+" nullFlavor=\"UNK\" />";
      }
    };

    ejs.helpers.addressTags = function(addressDict) {
      if (!addressDict) {
        return '<streetAddressLine nullFlavor="NI" />\n' +
                '<city nullFlavor="NI" />\n' +
                '<state nullFlavor="NI" />\n' +
                '<postalCode nullFlavor="NI" />\n' +
                '<country nullFlavor="NI" />\n';
      }
      
      var tags = '';
      if (!addressDict.street.length) {
        tags += ejs.helpers.simpleTag('streetAddressLine', null) + '\n';
      } else {
        for (var i=0; i<addressDict.street.length; i++) {
          tags += ejs.helpers.simpleTag('streetAddressLine', addressDict.street[i]) + '\n';
        }
      }
      tags += ejs.helpers.simpleTag('city', addressDict.city) + '\n';
      tags += ejs.helpers.simpleTag('state', addressDict.state) + '\n';
      tags += ejs.helpers.simpleTag('postalCode', addressDict.zip) + '\n';
      tags += ejs.helpers.simpleTag('country', addressDict.country) + '\n';
      return tags;
    };

  }
  
  return {
    method: method
  };
  
})();
