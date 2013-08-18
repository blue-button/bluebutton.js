# Demographics

Use the `demographics` method to retrieve the patient's personal information:

```javascript
bb.demographics();
```

This returns:

```javascript
{
  name: {
    prefix: "Mr.",
    given: "Adam",
    call_me: "Frankie",
    middle: "M",
    family: "Everyman"
  },
  dob: "1954-11-25",
  gender: "male",
  age: 64,
  marital_status: "married",
  address: {
    street: "17 Daws Rd.",
    city: "Blue Bell",
    state: "MA",
    country: "US",
    zip: "02368"
  },
  phone: {
    home: "555-555-1212",
    work: "555-555-1010"
  },
  email: "adam@email.com",
  race: {
    label: "White",
    code: "2106-3",
    code_system: "2.16.840.1.113883.6.238",
    code_system_name: "Race & Ethnicity - CDC"
  },
  ethnicity: {
    label: "Not Hispanic or Latino",
    code: "2186-5",
    code_system: "2.16.840.1.113883.6.238",
    code_system_name: "Race & Ethnicity - CDC"
  },
  religion: {
    label: "Christian (non-Catholic, non-specific)",
    code: "1013",
    code_system: "2.16.840.1.113883.1.11.19185",
    code_system_name: "HL7 Religious Affiliation"
  },
  guardian: {
    name: {
      given: "Ralph",
      family: "Relative"
    },
    relationship: "Grandfather",
    address: {
      street: "17 Daws Rd.",
      city: "Blue Bell",
      state: "MA",
      country: "US",
      zip: "02368"
    },
    phone: "781-555-1212"
  },
  birthplace: {
    state: "MA",
    zip: "02368",
    country: "US"
  },
  provider: {
    name: "Good Health Clinic",
    phone: "781-555-1212",
    address: {
      street: "21 North Ave",
      city: "Burlington",
      state: "MA",
      zip: "02368",
      country: "US"
    }
  }
}
```




