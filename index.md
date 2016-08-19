---
layout: template/main
edit_page: false
---

<style>.main { padding: 0; }</style>

<div class="home first">
  <div class="content">
    <div class="box">
      <h1>Healthcare data made simple.</h1>
      <p>BlueButton.js helps developers parse and generate complex health data formats like C-CDA with ease, so you can empower patients with access to their health records.</p>
      <div class="center">
        <a class="button" href="{{ site.baseurl }}/sandbox"><span>Live Demo</span></a>
      </div>
    </div>
  </div>
</div>

<div class="home second">
  <div class="content">
    <ul>
      
      <li>
        <div class="icon heart"></div>
        <h2>Abstract Away That 200 Page Spec</h2>
        <p>Named after the <a href="http://healthit.gov/bluebutton">Blue Button</a> initiative, BlueButton.js was designed to simplify working with health data, so you as a developer can help patients get access to their data and get it to whomever is caring for them. <a href="http://www.cms.gov/Regulations-and-Guidance/Legislation/EHRIncentivePrograms/Stage_2.html">Meaningful Use Stage 2</a> and <a href="http://bluebuttonplus.org/">Blue Button+</a> are encouraging wide adoption of an XML-based format called "Consolidated Clinical Document Architecture" (C-CDA), but the <a href="http://www.hl7.org/implement/standards/product_brief.cfm?product_id=258">specification</a> for this format is huge and scary, and reference implementations are hard to come by. No sweat – BlueButton.js converts C-CDAs into much simpler JSON and can also generate MU Stage 2 certified C-CDAs for you from that JSON.</p>
      </li>

      <li>
        <div class="icon console"></div>
        <h2>All JavaScript</h2>
        <p>With support for both Node.js and the browser, you can use BlueButton.js everywhere. It's easy to call Node from the command-line from other languages like Python and Ruby, so you can use BlueButton.js on your server without any complicated setup. And, of course, using it in the browser is as simple as adding a script tag.</p>
      </li>

      <li>
        <div class="icon page"></div>
        <h2>Support for the Real World</h2>
        <p>C-CDA isn't the first attempt to improve healthcare data interchange, so we support the most popular legacy format, C32 CCDs, and are open to supporting others. BlueButton.js is used in production by multiple companies, and we make an effort to parse the widest range of real world data possible. It's also under an MIT license, which means you can use it in commercial software.</p>
      </li>

      <li>
        <div class="icon oss"></div>
        <h2>Open Source</h2>
        <p>BlueButton.js is hosted on <a href="https://github.com/blue-button/bluebutton.js">Github</a>, so you can feel free to fork it for your own projects, use it as guidance for an implementation in another language, let us know about issues with real world data, and contribute improvements!</p>
      </li>
      
    </ul>
  </div>
</div>
