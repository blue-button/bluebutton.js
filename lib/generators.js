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
    var pad = function(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
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

    ejs.filters.hl7Code = function(obj) {
      if (!obj) { return ''; }

      var tag = '';
      var name = obj.name || '';
      if (obj.name) { tag += 'displayName="'+name+'"'; }

      if (obj.code) {
        tag += ' code="'+obj.code+'"';
        if (obj.code_system) { tag += ' codeSystem="'+obj.code_system+'"'; }
        if (obj.code_system_name) { tag += ' codeSystemName="'+obj.code_system_name+'"'; }
      }

      if (!obj.name && ! obj.code) {
        return 'nullFlavor="UNK"';
      }
      
      return tag;
    };

  }
  
  return {
    method: method
  };
  
})();
