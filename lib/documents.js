/*
 * ...
 */

/* exported Documents */
var Documents = (function () {
  
  /*
   * ...
   */
  var detect = function (data) {
    if (!data.template) {
      return 'json';
    }
    
    if (!data.template('2.16.840.1.113883.3.88.11.32.1').isEmpty()) {
      return 'c32';
    } else if(!data.template('2.16.840.1.113883.10.20.22.1.1').isEmpty()) {
      return 'ccda';
    }
  };
  
  
  /*
   * Get entries within an element (with tag name 'entry'), adds an `each` function
   */
  var entries = function () {
    var each = function (callback) {
      for (var i = 0; i < this.length; i++) {
        callback(this[i]);
      }
    };
    
    var els = this.elsByTag('entry');
    els.each = each;
    return els;
  };
  
  
  /*
   * Parses an HL7 date in String form and creates a new Date object.
   * 
   * TODO: CCDA dates can be in form:
   *   <effectiveTime value="20130703094812"/>
   * ...or:
   *   <effectiveTime>
   *     <low value="19630617120000"/>
   *     <high value="20110207100000"/>
   *   </effectiveTime>
   * For the latter, parseDate will not be given type `String`
   * and will return `null`.
   */
  var parseDate = function (str) {
    if (!str || typeof str !== 'string') {
      return null;
    }

    // Note: months start at 0 (so January is month 0)

    // e.g., value="1999" translates to Jan 1, 1999
    if (str.length === 4) {
      return new Date(str, 0, 1);
    }

    var year = str.substr(0, 4);
    // subtract 1 from the month since they're zero-indexed
    var month = parseInt(str.substr(4, 2), 10) - 1;
    // days are not zero-indexed. If we end up with the day 0 or '',
    // that will be equivalent to the last day of the previous month
    var day = str.substr(6, 2) || 1;

    // check for time info (the presence of at least hours and mins after the date)
    if (str.length >= 12) {
      var hour = str.substr(8, 2);
      var min = str.substr(10, 2);
      var secs = str.substr(12, 2);

      // check for timezone info (the presence of chars after the seconds place)
      if (str.length > 14) {
        // _utcOffsetFromString will return 0 if there's no utc offset found.
        var utcOffset = _utcOffsetFromString(str.substr(14));
        // We subtract that offset from the local time to get back to UTC
        // (e.g., if we're -480 mins behind UTC, we add 480 mins to get back to UTC)
        min = _toInt(min) - utcOffset;
      }

      var date = new Date(Date.UTC(year, month, day, hour, min, secs));
      // This flag lets us output datetime-precision in our JSON even if the time happens
      // to translate to midnight local time. If we clone the date object, it is not
      // guaranteed to survive.
      date._parsedWithTimeData = true;
      return date;
    }

    return new Date(year, month, day);
  };

  // These regexes and the two functions below are copied from moment.js
  // http://momentjs.com/
  // https://github.com/moment/moment/blob/develop/LICENSE
  var parseTimezoneChunker = /([\+\-]|\d\d)/gi;
  var parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
  function _utcOffsetFromString(string) {
      string = string || '';
      var possibleTzMatches = (string.match(parseTokenTimezone) || []),
          tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
          parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
          minutes = +(parts[1] * 60) + _toInt(parts[2]);

      return parts[0] === '+' ? minutes : -minutes;
  }
  function _toInt(argumentForCoercion) {
      var coercedNumber = +argumentForCoercion,
          value = 0;

      if (coercedNumber !== 0 && isFinite(coercedNumber)) {
          if (coercedNumber >= 0) {
              value = Math.floor(coercedNumber);
          } else {
              value = Math.ceil(coercedNumber);
          }
      }

      return value;
  }
  
  
  /*
   * Parses an HL7 name (prefix / given [] / family)
   */
  var parseName = function (nameEl) {
    var prefix = nameEl.tag('prefix').val();
    
    var els = nameEl.elsByTag('given');
    var given = [];
    for (var i = 0; i < els.length; i++) {
      var val = els[i].val();
      if (val) { given.push(val); }
    }
    
    var family = nameEl.tag('family').val();
    
    return {
      prefix: prefix,
      given: given,
      family: family
    };
  };
  
  
  /*
   * Parses an HL7 address (streetAddressLine [], city, state, postalCode, country)
   */
  var parseAddress = function (addrEl) {
    var els = addrEl.elsByTag('streetAddressLine');
    var street = [];
    
    for (var i = 0; i < els.length; i++) {
      var val = els[i].val();
      if (val) { street.push(val); }
    }
    
    var city = addrEl.tag('city').val(),
        state = addrEl.tag('state').val(),
        zip = addrEl.tag('postalCode').val(),
        country = addrEl.tag('country').val();
    
    return {
      street: street,
      city: city,
      state: state,
      zip: zip,
      country: country
    };
  };

  // Node-specific code for unit tests
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        parseDate: parseDate
      };
    }
  }
  
  
  return {
    detect: detect,
    entries: entries,
    parseDate: parseDate,
    parseName: parseName,
    parseAddress: parseAddress
  };
  
})();
