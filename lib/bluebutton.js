/*
 * ...
 */

/* exported BlueButton */
var BlueButton = function (source, opts) {
  var type, parsedData, parsedDocument;
  
  // Look for options
  if (!opts) opts = {};
  
  // Detect and parse the source data
  parsedData = Core.parseData(source);
  
  // Detect and parse the document
  if (opts.parser) {
    
    // TODO: parse the document with provided custom parser
    parsedDocument = opts.parser();
    
  } else {
    type = Documents.detect(parsedData);
    switch (type) {
      case 'c32':
        parsedData = Documents.C32.process(parsedData);
        parsedDocument = Parsers.C32.run(parsedData);
        break;
      case 'ccda':
        parsedData = Documents.CCDA.process(parsedData);
        parsedDocument = Parsers.CCDA.run(parsedData);
        break;
    }
  }
  
  return {
    type: type,
    data: parsedDocument,
    source: parsedData
  };

};
