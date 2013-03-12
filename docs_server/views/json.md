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
<button onclick="load('ccda')">Use CCDA Sample Data and Convert</button> <button onclick="load('va_c32')">Use VA C32 Sample Data and Convert</button> <button onclick="convert()">Convert</button> <button onclick="clearAll()">Clear</button>

[Demographics](#demographics-section), [Allergies](#allergies-section), [Encounters](#encounters-section), [Immunizations](#immunizations-section), [Labs](#labs-section), [Medications](#medications-section), [Problems](#problems-section), [Procedures](#procedures-section), [Vitals](#vitals-section)

<a name="demographics-section"></a>

## Demographics

<pre><code id="demographics" class="javascript"></code></pre>


<a name="allergies-section"></a>

## Allergies

<pre><code id="allergies" class="javascript"></code></pre>


<a name="encounters-section"></a>

## Encounters

<pre><code id="encounters" class="javascript"></code></pre>


<a name="immunizations-section"></a>

## Immunizations

<pre><code id="immunizations" class="javascript"></code></pre>


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


<a name="vitals-section"></a>

## Vitals

<pre><code id="vitals" class="javascript"></code></pre>


<script src="/bluebutton-latest-dev.js"></script>
<script>
  
  var xml, bb;
  var demographics = document.getElementById('demographics');
  var allergies = document.getElementById('allergies');
  var encounters = document.getElementById('encounters');
  var immunizations = document.getElementById('immunizations');
  var labs = document.getElementById('labs');
  var medications = document.getElementById('medications');
  var problems = document.getElementById('problems');
  var procedures = document.getElementById('procedures');
  var vitals = document.getElementById('vitals');
  
  function hl(src) {
    return hljs.highlight('javascript', src).value
  }
  
  function load(kind) {
    var xhReq = new XMLHttpRequest();
    
    var url;
    switch (kind) {
      case 'ccda': url = '/hl7_ccd.xml'
        break;
      case 'va_c32': url = '/VA_CCD_Sample_File_Version_12_3.xml'
        break;
    }
    
    xhReq.open('GET', url, false);
    xhReq.send(null);
    var xml = xhReq.responseText;
    
    // TODO: Replace '\t' in xml with '  '
    xml = xml.replace(/\t/g, '  ');
    
    document.getElementById('xml').value = '';
    clearAll();
    document.getElementById('xml').value = xml;
    convert();
  }
  
  function clearAll() {
    var els = document.getElementsByTagName('code');
    
    // i = 1 so it doesn't clear the sample usage example
    for (var i = 1; i < els.length; i++) {
      els[i].innerHTML = '';
    };
    
    bb = null;
  }
  
  function convert() {
    clearAll();
    xml = document.getElementById('xml').value;
    bb = BlueButton(xml);
    
    demographics.innerHTML = hl(bb.demographics().json());
    allergies.innerHTML = hl(bb.allergies().json());
    encounters.innerHTML = hl(bb.encounters().json());
    immunizations.innerHTML = hl(bb.immunizations().json());
    labs.innerHTML = hl(bb.labs().json());
    medications.innerHTML = hl(bb.medications().json());
    problems.innerHTML = hl(bb.problems().json());
    procedures.innerHTML = hl(bb.procedures().json());
    vitals.innerHTML = hl(bb.vitals().json());
  }

</script>
