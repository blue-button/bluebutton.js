/**
 * BlueButton.js
 */

(function () {
var Core=function(){return{parseXML:function(a){if(!a||"string"!==typeof a)return console.log("Error: XML data is not a string"),null;var b;window.DOMParser?(parser=new DOMParser,b=parser.parseFromString(a,"text/xml")):(b=new ActiveXObject("Microsoft.XMLDOM"),b.async="false",b.loadXML(a));return b},getElementByTagAttrValue:function(a,b,d,c){a=a.getElementsByTagName(b);for(b=0;b<a.length;b++)if(a[b].attributes.getNamedItem(d).nodeValue===c)return a[b]}}}();var Labs=function(){return{a:function(a){return this.getData()+" labs:"+a},b:function(){},extract:function(a){a=Core.getElementByTagAttrValue(a,"templateId","root","2.16.840.1.113883.10.20.22.2.3.1");a=a.parentElement;return a=a.getElementsByTagName("value")}}}();var BlueButton=function(a){var b=Labs.a,d=Labs.b,c=null,e={},c=Core.parseXML(a);e.labs=Labs.extract(c);return{labs:b,labRanges:d,getData:function(){return e},xmlDOM:c}};window.BlueButton=BlueButton;
})();
