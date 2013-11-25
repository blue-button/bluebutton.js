//Example of using BB.js from Node

var BB = require("../build/bluebutton.min.js");

var fs = require("fs");

var data = fs.readFileSync( "./ccda/CCD.example.xml" );

var bb = BB(data.toString());

console.log(JSON.stringify(bb.document(), null, 4));

console.log(JSON.stringify(bb.allergies(), null, 4));
console.log(JSON.stringify(bb.demographics(), null, 4));
console.log(JSON.stringify(bb.encounters(), null, 4));
console.log(JSON.stringify(bb.immunizations(), null, 4));
console.log(JSON.stringify(bb.labs(), null, 4));
console.log(JSON.stringify(bb.medications(), null, 4));
console.log(JSON.stringify(bb.problems(), null, 4));
console.log(JSON.stringify(bb.procedures(), null, 4));
console.log(JSON.stringify(bb.vitals(), null, 4));
