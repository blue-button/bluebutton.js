# Demographics

Use the `demographics` method to retrieve the patient's personal information:

```javascript
bb.demographics();
```

This returns:

```javascript
{
  name: {
    prefix: "Mr."
    given: "Ralph",
    middle: "M",
    family: "Romero"
  },
  address: {
    street: "17 Daws Rd."
    city: "Blue Bell"
    country: "USA"
    zip: 02368
  },
  phone: {
    home: "555-555-1212"
    work: "555-555-1010"
  },
  dob: "1954-11-25T00:00:00",
  gender: "male",
  age: 64,
  marital_status: "married",
  race: "white",
  religion: "Christian (non-Catholic, non-specific)"
}
```




