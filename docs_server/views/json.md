# JSON Test

This converts each section of a CCDA document in XML to JSON, for example:

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
<button onclick="load()">Use Sample Data and Convert</button> <button onclick="convert()">Convert</button>

## Demographics

<pre><code id="demographics"></code></pre>

## Immunizations

<pre><code id="immunizations" class="javascript"></code></pre>

## Medications

<pre><code id="medications"></code></pre>

## Labs

<pre><code id="labs"></code></pre>

## Allergies

<pre><code id="allergies"></code></pre>

## Encounters

<pre><code id="encounters"></code></pre>

## Problems

<pre><code id="problems"></code></pre>

## Procedures

<pre><code id="procedures"></code></pre>

## Vitals

<pre><code id="vitals"></code></pre>

<script src="/bluebutton-latest-dev.js"></script>
<script>
  
  var xml, bb;
  var demographics = document.getElementById('demographics');
  var immunizations = document.getElementById('immunizations');
  var medications = document.getElementById('medications');
  var labs = document.getElementById('labs');
  var allergies = document.getElementById('allergies');
  var encounters = document.getElementById('encounters');
  var problems = document.getElementById('problems');
  var procedures = document.getElementById('procedures');
  var vitals = document.getElementById('vitals');
  
  function hl (src) {
    return hljs.highlight("javascript", src).value
  }
  
  function load () {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "/hl7_ccd.xml", false);
    xhReq.send(null);
    var xml = xhReq.responseText;
    
    // TODO: Replace '\t' in xml with '  '
    xml = xml.replace(/\t/g, '  ');
    
    document.getElementById('xml').value = xml;
    convert();
  }
  
  function convert() {
    demographics.innerHTML = "";
    immunizations.innerHTML = "";
    medications.innerHTML = "";
    labs.innerHTML = "";
    allergies.innerHTML = "";
    encounters.innerHTML = "";
    problems.innerHTML = "";
    procedures.innerHTML = "";
    vitals.innerHTML = "";
    
    xml = document.getElementById('xml').value;
    bb = null;
    bb = BlueButton(xml);
    
    // demographics.innerHTML = bb.demographics.json();
    
    immunizations.innerHTML = hl(bb.immunizations().json());
    medications.innerHTML = hl(bb.medications().json());
    labs.innerHTML = hl(bb.labs().json());
    problems.innerHTML = hl(bb.problems().json());
    procedures.innerHTML = hl(bb.procedures().json());
  }

</script>









