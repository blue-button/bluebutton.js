/*
 * ...
 */

Generators.CCDA = (function () {
  
  /*
   * Generates a CCDA document
   */
  var run = function (json, template) {
    if (!ejs) {
      console.log("The BB.js Generator (JSON->XML) requires the EJS template package. " +
                  "Install it in Node or include it before this package in the browser.");
      return null;
    }
    if (!template) {
      console.log("Please provide a template EJS file for the Generator to use. " +
                  "Load it via fs.readFileSync in Node or XHR in the browser.");
      return null;
    }

    var ccda = ejs.render(template, {
      filename: 'ccda.xml',
      bb: json,
      now: (new Date()),
      codes: Core.Codes
    });
    return ccda;
  };
  
  return {
    run: run
  };
  
})();
