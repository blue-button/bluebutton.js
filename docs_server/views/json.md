# JSON Test

This converts each section of a CCDA document in XML to JSON, using for example:

```javascript
var bb = BlueButton(xml);
bb.medications().json();
```

## CCDA XML

<textarea id="xml"></textarea>

<style type="text/css">
  button {
    font-size: 13px;
  }
  textarea {
    width: 100%;
    height: 350px;
    font-size: 14px;
    font-family: 'menlo', monospace;
    white-space: pre;
  }
</style>
<button onclick="load()">Use Sample Data and Convert</button> <button onclick="convert()">Convert</button> <button onclick="clearAll()">Clear</button>

[Demographics](#demographics-section), [Allergies](#allergies-section), [Encounters](#encounters-section), [Immunizations](#immunizations-section), [Labs](#labs-section), [Medications](#medications-section), [Care Plan](#plan-section), [Problems](#problems-section), [Procedures](#procedures-section), [Vitals](#vitals-section)

<a name="demographics-section"></a>

## Demographics

<pre><code id="demographics"></code></pre>


<a name="allergies-section"></a>

## Allergies

<pre><code id="allergies"></code></pre>


<a name="encounters-section"></a>

## Encounters

<pre><code id="encounters"></code></pre>


<a name="immunizations-section"></a>

## Immunizations

<pre><code id="immunizations" class="javascript"></code></pre>


<a name="labs-section"></a>

## Labs

<pre><code id="labs"></code></pre>


<a name="medications-section"></a>

## Medications

<pre><code id="medications"></code></pre>


<a name="plan-section"></a>

## Care Plan

<pre><code id="plan"></code></pre>


<a name="problems-section"></a>

## Problems

<pre><code id="problems"></code></pre>


<a name="procedures-section"></a>

## Procedures

<pre><code id="procedures"></code></pre>


<a name="vitals-section"></a>

## Vitals

<pre><code id="vitals"></code></pre>


<script src="/bluebutton-latest-dev.js"></script>
<script>
  
  var xml, bb;
  var demographics = document.getElementById('demographics');
  var allergies = document.getElementById('allergies');
  var encounters = document.getElementById('encounters');
  var immunizations = document.getElementById('immunizations');
  var labs = document.getElementById('labs');
  var medications = document.getElementById('medications');
  var plan = document.getElementById('plan');
  var problems = document.getElementById('problems');
  var procedures = document.getElementById('procedures');
  var vitals = document.getElementById('vitals');
  
  function hl(src) {
    return hljs.highlight('javascript', src).value
  }
  
  function load() {
    var xhReq = new XMLHttpRequest();
    xhReq.open('GET', '/hl7_ccd.xml', false);
    xhReq.send(null);
    var xml = xhReq.responseText;
    
    // TODO: Replace '\t' in xml with '  '
    xml = xml.replace(/\t/g, '  ');
    
    clearAll();
    document.getElementById('xml').value = xml;
    convert();
  }
  
  function clearAll() {
    document.getElementById('xml').value = '';
    
    demographics.innerHTML = '';
    allergies.innerHTML = '';
    encounters.innerHTML = '';
    immunizations.innerHTML = '';
    labs.innerHTML = '';
    medications.innerHTML = '';
    plan.innerHTML = '';
    problems.innerHTML = '';
    procedures.innerHTML = '';
    vitals.innerHTML = '';
    
    bb = null;
  }
  
  function convert() {
    xml = document.getElementById('xml').value;
    bb = BlueButton(xml);
    
    demographics.innerHTML = hl(bb.demographics().json());
    allergies.innerHTML = hl(bb.allergies().json());
    encounters.innerHTML = hl(bb.encounters().json());
    immunizations.innerHTML = hl(bb.immunizations().json());
    labs.innerHTML = hl(bb.labs().json());
    medications.innerHTML = hl(bb.medications().json());
    plan.innerHTML = hl(bb.plan().json());
    problems.innerHTML = hl(bb.problems().json());
    procedures.innerHTML = hl(bb.procedures().json());
    vitals.innerHTML = hl(bb.vitals().json());
  }

</script>
