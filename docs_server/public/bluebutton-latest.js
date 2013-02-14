/**
 * BlueButton.js
 */

// v.0.0.1


(function () {
var Core=function(){var b=function(b,a,c,f){b=b.getElementsByTagName(a);for(a=0;a<b.length;a++)if(b[a].getAttribute(c)===f)return b[a]};return{parseXML:function(b){if(!b||"string"!==typeof b)return console.log("Error: XML data is not a string"),null;var a;window.DOMParser?(parser=new DOMParser,a=parser.parseFromString(b,"text/xml")):(a=new ActiveXObject("Microsoft.XMLDOM"),a.async="false",a.loadXML(b));return a},getElementByTagAttrValue:b,getSection:function(d,a){return b(d,"templateId","root",a)}}}();var Immunizations=function(){return{process:function(b){var d=[],a;a=Core.getSection(b,"2.16.840.1.113883.10.20.22.2.2");b=a.parentElement.getElementsByTagName("entry");for(var c=0;c<b.length;c++){a=b[c].getElementsByTagName("effectiveTime")[0];var f=a.getAttribute("value");a=b[c].getElementsByTagName("consumable")[0];a=a.getElementsByTagName("code")[0];var g=a.getAttribute("displayName"),h=a.getAttribute("code"),j=a.getAttribute("codeSystem"),k=a.getAttribute("codeSystemName");a=b[c].getElementsByTagName("routeCode")[0];
var l=a.getAttribute("displayName"),m=a.getAttribute("code"),n=a.getAttribute("codeSystem"),p=a.getAttribute("codeSystemName");a=b[c].getElementsByTagName("entryRelationship")[0];var e=a.getElementsByTagName("code")[0],q=e.getAttribute("displayName"),r=a.getElementsByTagName("text")[0].childNodes[0].nodeValue,s=e.getAttribute("code"),e=e.getAttribute("codeSystem");a=b[c].getElementsByTagName("translation")[0];var t=a.getAttribute("displayName"),u=a.getAttribute("code"),v=a.getAttribute("codeSystem");
a=a.getAttribute("codeSystemName");d.push({date:f,product:{name:g,code:h,hl7_code_system:j,code_system_name:k},route:{name:l,code:m,code_system:n,code_system_name:p},instructions:{name:q,text:r,code:s,code_system:e},translation:{name:t,code:u,code_system:v,code_system_name:a}})}return d}}}();var Labs=function(){return{a:function(b){return this.getData()+" labs:"+b},b:function(){},extract:function(b){b=Core.getElementByTagAttrValue(b,"templateId","root","2.16.840.1.113883.10.20.22.2.3.1");b=b.parentElement;return b=b.getElementsByTagName("value")}}}();var BlueButton=function(b){var d=null,a={},c="",d=Core.parseXML(b);a.immunizations=Immunizations.process(d);c=JSON.stringify(a,null,2);return{data:a,json:c,xmlDOM:d,immunizations:a.immunizations}};window.BlueButton=BlueButton;
})();
