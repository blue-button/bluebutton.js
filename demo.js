var fs = require('fs');
var BlueButton = require('./build/bluebutton');

var data = fs.readFileSync(
  './components/blue-button-reference-ccda/blue_button_reference_ccda.xml',
  'utf-8'
);

console.log('starting bluebutton...');
var bb = BlueButton(data);
console.log('bb returned...');
console.log(bb.document());