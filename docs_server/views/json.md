# JSON Test

This converts CCDA XML to JSON using:

```
bb = BlueButton(xml);
bb.json;
```

## XML

<textarea id="xml"></textarea>

<style type="text/css">
  textarea {
    width: 100%;
    height: 350px;
    font-size: 14px;
    font-family: monospace;
  }
</style>
<button onclick="load()">Use Sample Data and Convert</button> <button onclick="convert()">Convert</button>

## BB JSON

<textarea id="json"></textarea>

<script src="/bluebutton-latest-dev.js"></script>
<script>
  
  var xml, bb;
  
  function load () {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "/hl7_ccd.xml", false);
    xhReq.send(null);
    var xml = xhReq.responseText;
    
    document.getElementById('xml').value = xml;
    convert();
  }
  
  function convert() {
    bb = null;
    xml = document.getElementById('xml').value;
    document.getElementById('json').value = "";
    bb = BlueButton(xml);
    document.getElementById('json').value = bb.json;
  }

</script>
