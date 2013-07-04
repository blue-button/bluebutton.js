var fs = require('fs');
var BlueButton = require('./build/bluebutton');

var data = fs.readFileSync(
  './components/blue-button-reference-ccda/blue_button_reference_ccda.xml',
  'utf-8'
);

console.log('starting bluebutton...');
var bb = BlueButton(data);
console.log('writing record...');
fs.writeFile('node-record.json', bb.data.json(), function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});