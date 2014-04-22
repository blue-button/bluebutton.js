/*
 * document.js
 */

CCDA.Document = (function () {
  
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
   * Parse the document CCDA XML section.
   */
  var parse = function (xmlDOM) {
    var data = {}, el, author;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.1.1');
    author = el.tag('author');
    
    el = author.tag('assignedPerson').tag('name');
    var name_dict = parseName(el);

    el = author.tag('addr');
    var address_dict = parseAddress(el);

    el = author.tag('telecom');
    var work_phone = el.attr('value');
    
    data = {
      type: 'ccda',
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
