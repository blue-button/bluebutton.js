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
    
    if (source.charAt(0) === '<') {
      try {
        return Core.XML.parse(source);
      } catch (e) {
        if (console.log) {
          console.log("File looked like it might be XML but couldn't be parsed.");
        }
      }
    }

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
      /* By default, Dates are output as ISO Strings like "2014-01-03T08:00:00.000Z." This is
       * tricky when all we have is a date (not a datetime); JS sadly ignores that distinction.
       *
       * To paper over this JS wart, we use two different JSON formats for dates and datetimes.
       * This is a little ugly but makes sure that the dates/datetimes mostly just parse
       * correclty for clients:
       *
       * 1. Datetimes are rendered as standard ISO strings, without the misleading millisecond
       *    precision (misleading because we don't have it): YYYY-MM-DDTHH:mm:ssZ
       * 2. Dates are rendered as MM/DD/YYYY. This ensures they are parsed as midnight local-time,
       *    no matter what local time is, and therefore ensures the date is always correct.
       *    Outputting "YYYY-MM-DD" would lead most browsers/node to assume midnight UTC, which
       *    means "2014-04-27" suddenly turns into "04/26/2014 at 5PM" or just "04/26/2014"
       *    if you format it as a date...
       *
       * See http://stackoverflow.com/questions/2587345/javascript-date-parse and
       *     http://blog.dygraphs.com/2012/03/javascript-and-dates-what-mess.html
       * for more on this issue.
       */
      var originalValue = this[key]; // a Date

      if ( value && (originalValue instanceof Date) && !isNaN(originalValue.getTime()) ) {

        // If while parsing we indicated that there was time-data specified, or if we see
        // non-zero values in the hour/minutes/seconds/millis fields, output a datetime.
        if (originalValue._parsedWithTimeData ||
            originalValue.getHours() || originalValue.getMinutes() ||
            originalValue.getSeconds() || originalValue.getMilliseconds()) {

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
        
        // We just have a pure date
        return datePad( originalValue.getMonth() + 1 ) +
          '/' + datePad( originalValue.getDate() ) +
          '/' + originalValue.getFullYear();

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
