/*
 * document.js
 */

C32.Document = (function () {
  
  // Dependancies
  ///////////////////////////
  var parseName = Core.parseName;
  var parseAddress = Core.parseAddress;
  
  // Properties
  ///////////////////////////
  
  // Private Methods
  ///////////////////////////
  
  // Public Methods
  ///////////////////////////
  
  /*
   * Parse the document C32 XML section.
   */
  var parse = function (xmlDOM) {
    var data = {}, el, author;
    
    el = xmlDOM.template('2.16.840.1.113883.3.88.11.32.1');
    author = el.tag('author');
    
    el = author.tag('assignedPerson').tag('name');
    var name_dict = parseName(el);
    // Sometimes C32s include names that are just like <name>String</name>
    // and we still want to get something out in that case
    if (!name_dict.prefix && !name_dict.given.length && !name_dict.family) {
      name_dict.family = el.val();
    }

    el = author.tag('addr');
    var address_dict = parseAddress(el);

    el = author.tag('telecom');
    var work_phone = el.attr('value');
    
    data = {
      type: 'c32',
      author: {
        name: name_dict,
        address: address_dict,
        phone: {
          work: work_phone
        }
      }
    };

    return data;
  };
  
  // Init
  ///////////////////////////
  
  // Reveal public methods
  return {
    parse: parse
  };
  
})();
