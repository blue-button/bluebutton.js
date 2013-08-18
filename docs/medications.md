# Medications

Use the `medications` method to retrieve a list of all medications:

```javascript
bb.medications();  // Returns all medications as an Array
```

And an example medication object:

```javascript
{
  name: "Amlodipine Besylate 10mg Tab",
  instructions: "Take one tablet by mouth take one-half tablet for 1 day. Avoid grapefruit juice.",
  status: "active",
  refills: 3,
  filled: "20 Aug 2010",
  ordered: "13 Aug 2010",
  quantity: 45,
  days_supply: 90,
  pharmacy: "dayton",
  prescription_number: 2718953
}
```

ALTERNATE REPRESENTATION:

```javascript
{
  product: {
    name: "Proventil 0.09 MG/ACTUAT inhalant solution",
    codeSystemName: "RxNorm",
    codeSystem: "2.16.840.1.113883.6.88",
    code: 573621
  },
  date: 20110301,
  directions: "2 puffs QID PRN wheezing",
  instructions: "Generic Substitution Allowed",
  status: "active",
  drug_vehicle: {
    name: "Diethylene Glycol",
    code_system_name: "SNOWMED CT",
    code_system: "2.16.840.1.113883.6.96",
    code: 5955009
  },
  indication: {
    name: "Bronchitis",
    code_system_name: "SNOWMED CT",
    code_system: "2.16.840.1.113883.6.96",
    code: 32398004
  }
}
```




<!-- 
## Filters

```javascript
bb.medications({
  from: 2010,
  to: 2013,
  name: "amlodipine",
  status: "active",
  pharmacy: "dayton",
  refills: "<5",
  sortBy: "date"
});
```
-->











