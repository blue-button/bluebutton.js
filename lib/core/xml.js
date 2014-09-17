/*
 * ...
 */

Core.XML = (function () {
  
  /*
   * A function used to wrap DOM elements in an object so methods can be added
   * to the element object. IE8 does not allow methods to be added directly to
   * DOM objects.
   */
  var wrapElement = function (el) {
    function wrapElementHelper(currentEl) {
      return {
        el: currentEl,
        template: template,
        content: content,
        tag: tag,
        immediateChildTag: immediateChildTag,
        elsByTag: elsByTag,
        attr: attr,
        boolAttr: boolAttr,
        val: val,
        isEmpty: isEmpty
      };
    }
    
    // el is an array of elements
    if (el.length) {
      var els = [];
      for (var i = 0; i < el.length; i++) {
        els.push(wrapElementHelper(el[i]));
      }
      return els;
    
    // el is a single element
    } else {
      return wrapElementHelper(el);
    }
  };
  
  
  /*
   * Find element by tag name, then attribute value.
   */
  var tagAttrVal = function (el, tag, attr, value) {
    el = el.getElementsByTagName(tag);
    for (var i = 0; i < el.length; i++) {
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  
  /*
   * Search for a template ID, and return its parent element.
   * Example:
   *   <templateId root="2.16.840.1.113883.10.20.22.2.17"/>
   * Can be found using:
   *   el = dom.template('2.16.840.1.113883.10.20.22.2.17');
   */
  var template = function (templateId) {
    var el = tagAttrVal(this.el, 'templateId', 'root', templateId);
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el.parentNode);
    }
  };

  /*
   * Search for a content tag by "ID", and return it as an element.
   * These are used in the unstructured versions of each section but
   * referenced from the structured version sometimes.
   * Example:
   *   <content ID="UniqueNameReferencedElsewhere"/>
   * Can be found using:
   *   el = dom.content('UniqueNameReferencedElsewhere');
   *
   * We can't use `getElementById` because `ID` (the standard attribute name
   * in this context) is not the same attribute as `id` in XML, so there are no matches
   */
  var content = function (contentId) {
      var el = tagAttrVal(this.el, 'content', 'ID', contentId);
      if (!el) {
        // check the <td> tag too, which isn't really correct but
        // will inevitably be used sometimes because it looks like very
        // normal HTML to put the data directly in a <td>
        el = tagAttrVal(this.el, 'td', 'ID', contentId);
      }

      if (!el) {
        return emptyEl();
      } else {
        return wrapElement(el);
      }
    };
  
  
  /*
   * Search for the first occurrence of an element by tag name.
   */
  var tag = function (tag) {
    var el = this.el.getElementsByTagName(tag)[0];
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el);
    }
  };

  /*
   * Like `tag`, except it will only count a tag that is an immediate child of `this`.
   * This is useful for tags like "text" which A. may not be present for a given location
   * in every document and B. have a very different meaning depending on their positioning
   *
   *   <parent>
   *     <target></target>
   *   </parent>
   * vs.
   *   <parent>
   *     <intermediate>
   *       <target></target>
   *     </intermediate>
   *   </parent>
   * parent.immediateChildTag('target') will have a result in the first case but not in the second.
   */
  var immediateChildTag = function (tag) {
    var els = this.el.getElementsByTagName(tag);
    if (!els) { return null; }
    for (var i = 0; i < els.length; i++) {
      if (els[i].parentNode === this.el) {
        return wrapElement(els[i]);
      }
    }
    return emptyEl();
  };
  
  
  /*
   * Search for all elements by tag name.
   */
  var elsByTag = function (tag) {
    return wrapElement(this.el.getElementsByTagName(tag));
  };
  
  
  /*
   * Retrieve the element's attribute value. Example:
   *   value = el.attr('displayName');
   *
   * The browser and jsdom return "null" for empty attributes;
   * xmldom (which we now use because it's faster / can be explicitly
   * told to parse malformed XML as XML anyways), return the empty
   * string instead, so we fix that here.
   */
  var attr = function (attrName) {
    if (!this.el) { return null; }
    var attrVal = this.el.getAttribute(attrName);
    return attrVal || null;
  };

  /*
   * Wrapper for attr() for retrieving boolean attributes;
   * a raw call attr() will return Strings, which can be unexpected,
   * since the string 'false' will by truthy
   */
  var boolAttr = function (attrName) {
    var rawAttr = this.attr(attrName);
    if (rawAttr === 'true' || rawAttr === '1') {
      return true;
    }
    return false;
  };

  
  /*
   * Retrieve the element's value. For example, if the element is:
   *   <city>Madison</city>
   * Use:
   *   value = el.tag('city').val();
   *
   * This function also knows how to retrieve the value of <reference> tags,
   * which can store their content in a <content> tag in a totally different
   * part of the document.
   */
  var val = function () {
    if (!this.el) { return null; }
    if (!this.el.childNodes || !this.el.childNodes.length) { return null; }
    var textContent = this.el.textContent;

    // if there's no text value here and the only thing inside is a
    // <reference> tag, see if there's a linked <content> tag we can
    // get something out of
    if (!Core.stripWhitespace(textContent)) {

      var contentId;
      // "no text value" might mean there's just a reference tag
      if (this.el.childNodes.length === 1 &&
          this.el.childNodes[0].tagName === 'reference') {
        contentId = this.el.childNodes[0].getAttribute('value');

      // or maybe a newlines on top/above the reference tag
      } else if (this.el.childNodes.length === 3 &&
          this.el.childNodes[1].tagName === 'reference') {
        contentId = this.el.childNodes[1].getAttribute('value');

      } else {
        return textContent;
      }

      if (contentId && contentId[0] === '#') {
        contentId = contentId.slice(1); // get rid of the '#'
        var docRoot = wrapElement(this.el.ownerDocument);
        var contentTag = docRoot.content(contentId);
        return contentTag.val();
      }
    }

    return textContent;
  };
  
  
  /*
   * Creates and returns an empty DOM element with tag name "empty":
   *   <empty></empty>
   */
  var emptyEl = function () {
    var el = doc.createElement('empty');
    return wrapElement(el);
  };
  
  
  /*
   * Determines if the element is empty, i.e.:
   *   <empty></empty>
   * This element is created by function `emptyEL`.
   */
  var isEmpty = function () {
    if (this.el.tagName.toLowerCase() === 'empty') {
      return true;
    } else {
      return false;
    }
  };
  
  
  /*
   * Cross-browser XML parsing supporting IE8+ and Node.js.
   */
  var parse = function (data) {
    // XML data must be a string
    if (!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null;
    }
    
    var xml, parser;
    
    // Node
    if (isNode) {
      parser = new (xmldom.DOMParser)();
      xml = parser.parseFromString(data, "text/xml");
      
    // Browser
    } else {
      
      // Standard parser
      if (window.DOMParser) {
        parser = new DOMParser();
        xml = parser.parseFromString(data, "text/xml");
        
      // IE
      } else {
        try {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        } catch (e) {
          console.log("BB ActiveX Exception: Could not parse XML");
        }
      }
    }
    
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null;
    }
    
    return wrapElement(xml);
  };
  
  
  // Establish the root object, `window` in the browser, or `global` in Node.
  var root = this,
      xmldom,
      isNode = false,
      doc = root.document; // Will be `undefined` if we're in Node

  // Check if we're in Node. If so, pull in `xmldom` so we can simulate the DOM.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      isNode = true;
      xmldom = require("xmldom");
      doc = new xmldom.DOMImplementation().createDocument();
    }
  }
  
  
  return {
    parse: parse
  };
  
})();
