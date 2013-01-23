
var bb = BlueButton('bb');

bb.labs('hello');

bb.getData();

// Should return:
//   "bb converted"


var bb2 = BlueButton('bb2');

bb2.labs('goodbye');

bb2.getData();

// Should return:
//   "bb2 converted"


