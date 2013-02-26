// Allergies

{
  date: {
    value: parseDate("20090909"),
    low: parseDate("20090902"),
    high: parseDate("20100103")
  },
  observation_date: { low: parseDate("20110215") },
  name: "drug allergy",
  code: "416098002",
  code_system: "2.16.840.1.113883.6.96",
  code_system_name: "SNOMED CT",
  reaction_type: {
    name: "Adverse reaction to substance",
    code: "282100009",
    code_system: "2.16.840.1.113883.6.96",
    code_system_name: "SNOMED CT"
  },
  allergen: {
    name: "ALLERGENIC EXTRACT, PENICILLIN",
    code: "314422",
    code_system: "2.16.840.1.113883.6.88",
    code_system_name: "RxNorm"
  },
  status: "active",
  reaction: {
    date: { low: "20090711" },
    name: "Hives",
    code: "247472004",
    code_system: "2.16.840.1.113883.6.96"
  },
  severity: "moderate to severe"
}

// Demographics

{
  name: {
    prefix: "Mr.",
    given: ["Adam", "Frankie"],
    family: "Everyman"
  },
  dob: Core.date("19541125"),
  gender: "male",
  marital_status: "married",
  address: {
   street: ["17 Daws Rd.", "Apt 102"],
    city: "Blue Bell",
    state: "MA",
    country: "US",
    zip: "02368"
  },
  phone: {
    home: ["555-555-1212"],
    work: ["555-555-2323"],
    mobile: ["555-555-3434", "555-555-4545"]
  },
  email: "adam@email.com",
  race: "white",
  ethnicity: "Not Hispanic or Latino",
  religion: "Christian (non-Catholic, non-specific)",
  guardian: {
    name: {
      given: ["Ralph", "Frankie"],
      family: "Relative"
    },
    relationship: "Grandfather",
    address: {
      street: ["17 Daws Rd.", "Apt 102"],
      city: "Blue Bell",
      state: "MA",
      country: "US",
      zip: "02368"
    },
    phone: {
      home: ["781-555-1212"]
    }
  },
  birthplace: {
    state: "MA",
    zip: "02368",
    country: "US"
  },
  provider: {
    organization: "Good Health Clinic",
    phone: "781-555-1212",
    address: {
      street: ["21 North Ave"],
      city: "Burlington",
      state: "MA",
      zip: "02368",
      country: "US"
    }
  }
}

// Encounters

{
  date: Core.date("20000407"),
  name: "Office consultation - 15 minutes",
  finding: {
    name: "Bronchitis",
    code: "32398004",
    code_system: "2.16.840.1.113883.6.96"
  },
  code: "99241",
  code_system: "2.16.840.1.113883.6.12",
  code_system_name: "CPT",
  code_system_version: 4,
  translation: {
    name: "Ambulatory",
    code: "AMB",
    code_system: "2.16.840.1.113883.5.4",
    code_system_name: "HL7 ActEncounterCode"
  },
  performer: {
    name: "General Physician",
    code: "59058001",
    code_system: "2.16.840.1.113883.6.96",
    code_system_name: "SNOMED CT"
  },
  location: {
    organization: "Good Health Clinic",
    street: ["17 Daws Rd."],
    city: "Blue Bell",
    state: "MA",
    zip: "02368",
    country: "US",
    name: "General Acute Care Hospital",
    code: "GACH",
    code_system: "2.16.840.1.113883.5.111",
    code_system_name: "HL7 RoleCode"
  }
}

// Immunizations

{
  "date": "1999-11-30T05:00:00.000Z",
  "product": {
    "name": "Influenza virus vaccine",
    "code": "88",
    "code_system": "2.16.840.1.113883.6.59",
    "code_system_name": "CVX",
    "translation": {
      "name": "influenza, live, intranasal",
      "code": "111",
      "code_system": "2.16.840.1.113883.6.59",
      "code_system_name": "CVX"
    }
  }
}

// Labs

{
  name: "CBC WO DIFFERENTIAL",
  code: "43789009",
  code_system: "2.16.840.1.113883.6.96",
  code_system_name: "SNOMED CT",
  results: [
    {
      date: Core.date("200003231430"),
      name: "WBC",
      value: 6.7,
      unit: "10+3/ul",
      code: "33765-9",
      code_system: "2.16.840.1.113883.6.1",
      code_system_name: "LOINC",
      // reference == referenceRange
      reference: {
        low: 4.3,
        high: 10.8
      }
    }
  ]
}

// Medications

{
  effective_time: {
    low: Core.date("20110301"),
    high: Core.date("20120301")
  },
  product: {
    name: "Albuterol 0.09 MG/ACTUAT inhalant solution",
    code: "329498",
    code_system: "2.16.840.1.113883.6.88",
    translation: {
      name: "Proventil 0.09 MG/ACTUAT inhalant solution",
      code: "573621",
      code_system: "2.16.840.1.113883.6.88",
      code_system_name: "RxNorm"
    }
  },
  dose_quantity: 1,
  rate_quantity: {
    value: 90,
    unit: "ml/min"
  },
  precondition: {
    name: "Wheezing",
    code: "56018004",
    code_system: "2.16.840.1.113883.6.96"
  },
  reason: {
    name: "Bronchitis",
    code: "32398004",
    code_system: "2.16.840.1.113883.6.96"
  },
  route: {
    name: "RESPIRATORY (INHALATION)",
    code: "C38216",
    code_system: "2.16.840.1.113883.3.26.1.1",
    code_system_name: "NCI Thesaurus"
  },
  vehicle: {
    name: "Diethylene Glycol",
    code: "5955009",
    code_system: "2.16.840.1.113883.6.96",
    code_system_name: "SNOMED CT"
  },
  administration: {
    name: "INHALANT",
    code: "C42944",
    code_system: "2.16.840.1.113883.3.26.1.1",
    code_system_name: "NCI Thesaurus"
  },
  prescriber: {
    organization: "Good Health Clinic",
    person: "Dr. Robert Michaels"
  }
}

// Plan

{
  date: Core.date("20000421"),
  name: "Colonoscopy",
  code: "310634005",
  code_system: "2.16.840.1.113883.6.96"
}

// Problems

{
  date: {
    from: Core.date("199803"),
    to: Core.date("199803")
  },
  name: "Pneumonia",
  status: "Active",
  age: 57,
  code: "233604007",
  code_system: "2.16.840.1.113883.6.96"
}

// Procedures

{
  date: Core.date("20110215"),
  name: "Colonic polypectomy",
  code: "274025005",
  code_system: "2.16.840.1.113883.6.96",
  specimen: {
    name: "colonic polyp sample",
    code: "309226005",
    code_system: "2.16.840.1.113883.6.96"
  },
  performer: {
    organization: "Good Health Clinic",
    street: ["17 Daws Rd."],
    city: "Blue Bell",
    state: "MA",
    zip: "02368",
    country: "US",
    phone: "555-555-1234"
  },
  device: {
    name: "Colonoscope",
    code: "90412006",
    code_system: "2.16.840.1.113883.6.96"
  }
}

// Vitals

{
  date: Core.date("19991114"),
  results: [
    {
      name: "Height",
      code: "8302-2",
      code_system: "2.16.840.1.113883.6.1",
      code_system_name: "LOINC",
      value: 117,
      unit: "cm"
    },
    {
      name: "Patient Body Weight - Measured",
      code: "3141-9",
      code_system: "2.16.840.1.113883.6.1",
      code_system_name: "LOINC",
      value: 86,
      unit: "kg"
    },
    {
      name: "Intravascular Systolic",
      code: "8480-6",
      code_system: "2.16.840.1.113883.6.1",
      code_system_name: "LOINC",
      value: 132,
      unit: "mm[Hg]"
    }
  ]
}
















