JXON
====

A complete, bidirectional, JXON (lossless JavaScript XML Object Notation) library. Works like nodejs module, AMD module or creates global window.JXON object.

Implementation of Mozilla's [JXON](https://developer.mozilla.org/en-US/docs/JXON) code. Head over to MDN for [Documentation](https://developer.mozilla.org/en-US/docs/JXON#Usage).

Without changing the configuration, the library will work as original implementation. However, additional methods were added:

### JXON.config(cnf:Object)
- overrides default configuration properties
 
Example:
js```
JXON.config({
  valueKey: '_', // default: 'keyValue'
  attrKey: '$', //default: 'keyAttributes'
  attrPrefix: '$', // default: '@'
  lowerCaseTags: false, // default: true
  trueIsEmpty: false, // default: true
  autoDate: false // default: true
});
```
### JXON.parseXml(str:String)
- implementation of DOMParser.parseFromString, parses XML from string
