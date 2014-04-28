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
      return JSON.parse(source);
    }
  };
  
  
  /*
   * Removes leading and trailing whitespace from a string
   */
  var stripWhitespace = function (str) {
    return str.replace(/^\s+|\s+$/g,'');
  };
  
  
  /*
   * ...
   */
  var json = function () {
    return JSON.stringify(this, null, 2);
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
