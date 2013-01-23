
# BlueButton.js

A JavaScript library to work with Blue Button Continuity of Care Document (CCD) data.

This project is under heavy development and the API is subject to change, a lot!

## Sample Usage

```javascript
bb.labs();

bb.labs({
  from: '1-9-10',
  to: '7-14-12'
});

bb.labs({
  type: 'a1c'
});

bb.labs({
  type: [
    'a1c', 'hdl', 'ldl', 'tg'
  ]
});

bb.labRanges('chol');

// returns
// {
//   chol: {
//     min: 34,
//     max: 129
//   }
// }

bb.labRanges([
  'chol', 'hdl', 'ldl'
]);

// returns
// {
//   chol: {
//     min: 23,
//     max: 242
//   },
//   hdl: {
//     min: 22,
//     max: 45
//   },
//   ldl: {
//     min: 34,
//     max: 42
//   }
// }
```

<!--
## UI Examples

```javascript
bb.UI.labBar({
  name: 'hdl',
  date: '2-13-12',
  bind_to: 'hdl-bar'
});

bb.UI.medList({
  from: '8-16-10',
  to: '10-18-12',
  bind_to: 'my-meds'
});
```
-->
