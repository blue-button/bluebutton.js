/*
 * ...
 */

/* exported Core */
var Core = (function () {
  
  /*
   * ...
   */
  var parseData = function (source) {
    source = stripWhitespace(source);
    
    if (source.substr(0, 5) === '<?xml') {
      return Core.XML.parse(source);
    } else {
      try {
        return JSON.parse(source);
      } catch (e) {
        if (console.error) {
          console.error("Error: Cannot parse this file. BB.js only accepts valid XML " +
            "(for parsing) or JSON (for generation). If you are attempting to provide " +
            "XML or JSON, please run your data through a validator to see if it is malformed.\n");
        }
        throw e;
      }
    }
  };
  
  
  /*
   * Removes leading and trailing whitespace from a string
   */
  var stripWhitespace = function (str) {
    if (!str) { return str; }
    return str.replace(/^\s+|\s+$/g,'');
  };
  
  
  /*
   * A wrapper around JSON.stringify which allows us to produce customized JSON.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/
   *        JavaScript/Guide/Using_native_JSON#The_replacer_parameter
   * for documentation on the replacerFn.
   */
  var json = function () {

    var datePad = function(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    };
    
    var replacerFn = function(key, value) {
      /* By default, Dates are output as ISO Strings like "2014-01-03T08:00:00.000Z."
       * This is tricky when all we have is a date (not a datetime); JS ignores that distinction.
       *
       * Assuming dates are just at midnight local time is questionable and means our tests output
       * different UTC values in every timezone. Right now, we only have date-level precision
       * the vast majority of the time, so this will output a pure date string any time we
       * don't have significant time data. If we need to be able to output datetimes at
       * midnight in the future, we'll need a strategy for tracking the original precision.
       *
       * We output strings like 04/27/2014 because "2014-04-27" will be parsed
       * assuming midnight UTC (and so will turn to something like 04/26/2014 at 5PM).
       */
      var originalValue = this[key]; // a Date

      if ( value && (originalValue instanceof Date) && !isNaN(originalValue.getTime()) ) {
        if (!originalValue.getHours() && !originalValue.getMinutes() &&
            !originalValue.getSeconds() && !originalValue.getMilliseconds()) {
          
          return datePad( originalValue.getMonth() + 1 ) +
            '/' + datePad( originalValue.getDate() ) +
            '/' + originalValue.getFullYear();
        }
        
        // Even if we do have a real datetime, we never have millisecond level precision
        // but JSON.Stringify calls Date.toISOString, which will include those by default.
        // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/
        //    Reference/Global_Objects/Date/toISOString
        return originalValue.getUTCFullYear() +
          '-' + datePad( originalValue.getUTCMonth() + 1 ) +
          '-' + datePad( originalValue.getUTCDate() ) +
          'T' + datePad( originalValue.getUTCHours() ) +
          ':' + datePad( originalValue.getUTCMinutes() ) +
          ':' + datePad( originalValue.getUTCSeconds() ) +
          'Z';
      }

      return value;
    };
    
    return JSON.stringify(this, replacerFn, 2);
  };
  
  
  /*
   * Removes all `null` properties from an object.
   */
  var trim = function (o) {
    var y;
    for (var x in o) {
      if (o.hasOwnProperty(x)) {
        y = o[x];
        // if (y === null || (y instanceof Object && Object.keys(y).length == 0)) {
        if (y === null) {
          delete o[x];
        }
        if (y instanceof Object) y = trim(y);
      }
    }
    return o;
  };
  
  
  return {
    parseData: parseData,
    stripWhitespace: stripWhitespace,
    json: json,
    trim: trim
  };
  
})();
