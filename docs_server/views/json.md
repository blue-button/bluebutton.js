# JSON Test

## XML

<textarea id="xml"></textarea>

<style type="text/css">
  textarea {
    width: 100%;
    height: 300px;
  }
</style>
<button onclick="load()">Use Sample Data and Convert</button> <button onclick="convert()">Convert</button>

## BB JSON

<textarea id="json"></textarea>

<script src="https://raw.github.com/blue-button/bluebutton.js/master/build/bluebutton-0.0.1-dev.js"></script>
<script>
  
  var xml, bb;
  
  function load () {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "/hl7_ccd.xml", false);
    xhReq.send(null);
    var xml = xhReq.responseText;
    convert();
  }
  
  function convert() {
    // xml = document.getElementsByTagName('textarea')[0].value;
    document.getElementById('xml').value = xml;
    bb = BlueButton(xml);
    document.getElementById('json').value = bb.json;
  }

</script>
