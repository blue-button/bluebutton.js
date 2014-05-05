/*
 * ...
 */

Generators.CCDA = (function () {
  
  /*
   * Generates a CCDA document
   * A lot of the EJS setup happens in generators.js
   *
   * If `testingMode` is true, we'll set the "now" variable to a specific,
   * fixed time, so that the expected XML doesn't change across runs
   */
  var run = function (json, template, testingMode) {
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

    // `now` is actually now, unless we're running this for a test,
    // in which case it's always Jan 1, 2000 at 12PM UTC
    var now = (testingMode) ?
      new Date('2000-01-01T12:00:00Z') : new Date();

    var ccda = ejs.render(template, {
      filename: 'ccda.xml',
      bb: json,
      now: now,
      tagHelpers: ejs.helpers,
      codes: Core.Codes
    });
    return ccda;
  };
  
  return {
    run: run
  };
  
})();
