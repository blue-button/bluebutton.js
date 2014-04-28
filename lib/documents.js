/*
 * ...
 */

/* exported Documents */
var Documents = (function () {
  
  /*
   * ...
   */
  var detect = function (data) {
    if (!data.template('2.16.840.1.113883.3.88.11.32.1').isEmpty()) {
      return 'c32';
    } else if(!data.template('2.16.840.1.113883.10.20.22.1.2').isEmpty()) {
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
  
  
  return {
    detect: detect,
    entries: entries
  };
  
})();
