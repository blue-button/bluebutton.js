/**
 * BlueButton.js
 */

(function () {
(function(){var c,d,e;e={convert:function(a){return!data||"string"!==typeof data?null:a},parseXML:function(a){var b;window.DOMParser?(parser=new DOMParser,b=parser.parseFromString(a,"text/xml")):(b=new ActiveXObject("Microsoft.XMLDOM"),b.async="false",b.loadXML(a));return b}};c=function(a){return this.getData()+" labs:"+a};d=function(){};window.BlueButton=function(a){var b=null,b=e.convert(a);return{labs:c,labRanges:d,getData:function(){return b}}}})();
})();
