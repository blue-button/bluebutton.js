---
layout: page
---

# Sandbox

This demo converts each section of a CCD document in XML to JSON, using for example:

```javascript
var bb = BlueButton(xml);
bb.data.medications.json();
```

## Source Data

<p>Please don't use real patient data!</p>
<textarea id="xml"></textarea>

<style type="text/css">
  button {
    font-size: 13px;
  }
  textarea {
    width: 100%;
    height: 300px;
    font-size: 14px;
    font-family: 'menlo', monospace;
    white-space: pre;
  }
</style>

Use sample data and convert: <button onclick="load('bb_ref_ccda')">Sample CCDA</button> | <button onclick="convert()">Convert</button> <button onclick="clearAll()">Clear</button>

[Document](#document-section), [Demographics](#demographics-section), [Allergies](#allergies-section), [Encounters](#encounters-section), [Immunizations](#immunizations-section), [Labs](#labs-section), [Medications](#medications-section), [Problems](#problems-section), [Procedures](#procedures-section), [Vitals](#vitals-section)


<a name="document-section"></a>
## Document
<pre><code id="document" class="javascript"></code></pre>


<a name="demographics-section"></a>
## Demographics
<pre><code id="demographics" class="javascript"></code></pre>


<a name="allergies-section"></a>
## Allergies
<pre><code id="allergies" class="javascript"></code></pre>


<a name="careplan-section"></a>
## Care Plan
<pre><code id="careplan" class="javascript"></code></pre>


<a name="chiefcomplaint-section"></a>
## Chief Complaint
<pre><code id="chiefcomplaint" class="javascript"></code></pre>


<a name="encounters-section"></a>
## Encounters
<pre><code id="encounters" class="javascript"></code></pre>


<a name="functionalstatus-section"></a>
## Functional Status
<pre><code id="functionalstatus" class="javascript"></code></pre>


<a name="immunizations-section"></a>
## Immunizations
<pre><code id="immunizations" class="javascript"></code></pre>


<a name="instructions-section"></a>
## Patient Instructions
<pre><code id="instructions" class="javascript"></code></pre>


<a name="labs-section"></a>
## Labs
<pre><code id="labs" class="javascript"></code></pre>


<a name="medications-section"></a>
## Medications
<pre><code id="medications" class="javascript"></code></pre>


<a name="problems-section"></a>
## Problems
<pre><code id="problems" class="javascript"></code></pre>


<a name="procedures-section"></a>
## Procedures
<pre><code id="procedures" class="javascript"></code></pre>


<a name="smokingstatus-section"></a>
## Smoking Status
<pre><code id="smokingstatus" class="javascript"></code></pre>


<a name="vitals-section"></a>
## Vitals
<pre><code id="vitals" class="javascript"></code></pre>

<script src="//yandex.st/highlightjs/8.0/highlight.min.js"></script>
<!-- <script src="//github.com/blue-button/bluebutton.js/releases/download/0.1.0/bluebutton.js"></script> -->
<script src="/files/bluebutton.js"></script>
<script>
  var baseURL = "";
  var xml, bb;
  var doc = document.getElementById('document');
  var demographics = document.getElementById('demographics');
  var allergies = document.getElementById('allergies');
  var carePlan = document.getElementById('careplan');
  var chiefComplaint = document.getElementById('chiefcomplaint');
  var encounters = document.getElementById('encounters');
  var functionalStatus = document.getElementById('functionalstatus');
  var immunizations = document.getElementById('immunizations');
  var instructions = document.getElementById('instructions');
  var labs = document.getElementById('labs');
  var medications = document.getElementById('medications');
  var problems = document.getElementById('problems');
  var procedures = document.getElementById('procedures');
  var smokingStatus = document.getElementById('smokingstatus');
  var vitals = document.getElementById('vitals');
  
  function hl(src) {
    return hljs.highlight('javascript', src).value
  }
  
  function load(kind) {
    var xhReq = new XMLHttpRequest();
    
    var url;
    switch (kind) {
      case 'va_c32': url = '/VA_CCD_Sample_File_Version_12_4.xml';
        break;
      case 'bb_ref_ccda': url = baseURL + '/files/ccda.xml';
        break;
    }
    
    xhReq.open('GET', url, false);
    xhReq.send(null);
    var xml = xhReq.responseText;
    
    // TODO: Replace '\t' in xml with '  '
    xml = xml.replace(/\t/g, '  ');
    
    clearAll();
    document.getElementById('xml').value = xml;
    convert();
  }
  
  function clearAll() {
    clearXML();
    clearJSON();
  }
  
  function clearXML() { document.getElementById('xml').value = ''; }
  function clearJSON() {
    var els = document.getElementsByTagName('code');
    
    // i = 1 so it doesn't clear the sample usage example
    for (var i = 1; i < els.length; i++) {
      els[i].innerHTML = '';
    };
    
    bb = null;
  }
  
  function convert() {
    clearJSON();
    xml = document.getElementById('xml').value;
    bb = BlueButton(xml);
    
    doc.innerHTML = hl(bb.data.document.json());
    demographics.innerHTML = hl(bb.data.demographics.json());
    allergies.innerHTML = hl(bb.data.allergies.json());
    carePlan.innerHTML = hl(bb.data.care_plan.json());
    chiefComplaint.innerHTML = hl(bb.data.chief_complaint.json());
    encounters.innerHTML = hl(bb.data.encounters.json());
    functionalStatus.innerHTML = hl(bb.data.functional_statuses.json());
    immunizations.innerHTML = hl(bb.data.immunizations.json());
    instructions.innerHTML = hl(bb.data.instructions.json());
    labs.innerHTML = hl(bb.data.labs.json());
    medications.innerHTML = hl(bb.data.medications.json());
    problems.innerHTML = hl(bb.data.problems.json());
    procedures.innerHTML = hl(bb.data.procedures.json());
    smokingStatus.innerHTML = hl(bb.data.smoking_status.json());
    vitals.innerHTML = hl(bb.data.vitals.json());
  }

</script>
