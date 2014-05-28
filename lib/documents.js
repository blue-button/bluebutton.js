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
   * When latter, parseDate will not be given type `String`, but `null` and
   * log the error "date is not a string".
   */
  var parseDate = function (str) {
    if (!str || typeof str !== 'string') {
      // console.log("Error: date is not a string");
      return null;
    }
    var year = str.substr(0, 4);
    // months start at 0, because why not
    var month = parseInt(str.substr(4, 2), 10) - 1;
    var day = str.substr(6, 2);
    return new Date(year, month, day);
  };
  
  
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
  
  
  return {
    detect: detect,
    entries: entries,
    parseDate: parseDate,
    parseName: parseName,
    parseAddress: parseAddress
  };
  
})();
