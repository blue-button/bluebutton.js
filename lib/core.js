/*
 * ...
 */

/* exported Core */
var Core = (function () {
  
  /*
   * ...
   */
  var parseData = function (source) {
    
    var dataType = Core.detectDataType(source);
    
    switch (type) {
      case 'xml':
        parsedData = Core.XML.parse(source);
        break;
      case 'json':
        parsedData = JSON.parse(source);
        break;
    }
  };
  
  
  /*
   * Removes leading and trailing whitespace from a string
   */
  var stripWhitespace = function (str) {
    str = str.replace(/^\s+|\s+$/g,'');
  };
  
  
  /*
   * ...
   */
  var addJSON = function (objects) {
    var json = function () { return JSON.stringify(this, null, 2); };
    for (var i = 0; i < objects.length; i++) {
      objects[i].json = json;
    }
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
    trim: trim
  };
  
})();
