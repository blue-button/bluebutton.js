/*
 * core.js - Essential and shared functionality.
 */

var Core = function () {
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
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
    if (!str || typeof str !== "string") {
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
      given.push(els[i].val());
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
      street.push(els[i].val());
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
  
  /*
   * Removes all `null` properties from an object.
   */
  var trim = function (o) {
    var y;
    for (var x in o) {
      y = o[x];
      // if (y === null || (y instanceof Object && Object.keys(y).length == 0)) {
      if (y === null) {
        delete o[x];
      }
      if (y instanceof Object) y = trim(y);
    }
    return o;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parseDate: parseDate,
    parseName: parseName,
    parseAddress: parseAddress,
    trim: trim
  };
  
}();
