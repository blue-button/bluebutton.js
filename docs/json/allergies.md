---
layout: docs
---

# Allergies

Use the `allergies` method to retrieve a list of all allergies:

```javascript
bb.allergies();  // Returns all allergies as an Array
```

And an example allergy object:

```javascript
{
  name: "trimethoprim",
  location: "dayt29",
  date: "09 mar 2011",
  reaction: null,
  type: "drug",
  drug_class: "anti-infectives,other",
  observed: "historical",
  comments: "The reaction to this allergy was MILD (NO SQUELAE)"
}
```
