# Immunizations

Use the `immunizations` method to retrieve a list of all immunizations:

```javascript
bb.immunizations();  // Returns all immunizations as an Array
```

And an example immunization object:

```javascript
{
  product: {
    name: "Tetanus and diphtheria toxoids - preservative free",
    codeSystemName: "CVX",
    codeSystem: "2.16.840.1.113883.6.59",
    code: 573621
  },
  instructions: "Possible flu-like symptoms for three days.",
  date: 19981215,
  status: "completed"
}
```

ALTERNATE REPRESENTATION:

```javascript
{
  immunization: "Measles + Rubella (German Measles)",
  other: "none",
  method: "injection",
  date_received: "01 Mar 1950",
  reactions: "pain",
  comments: "Received as a child"
}
```


