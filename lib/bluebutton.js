/*
 * ...
 */

/* exported BlueButton */
var BlueButton = function (source, opts) {
  
  var parsedData, parsedDocument;
  
  // Detect and parse the source data
  parsedData = Core.parseData(source);
  
  // Detect and parse the document
  if (opts.parser) {
    
    // TODO: parse the document with provided custom parser
    
  } else {
    var documentType = Documents.detect(parsedData);
    switch (documentType) {
      case 'c32':
        parsedDocument = Parsers.C32.run(parsedData);
        break;
      case 'ccda':
        parsedDocument = Parsers.CCDA.run(parsedData);
        break;
    }
  }
  
  return {
    data: parsedDocument,
    source: parsedData
  };

};
