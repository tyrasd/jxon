JXON
====

A complete, bidirectional, JXON (lossless JavaScript XML Object Notation) library. Works like nodejs module, AMD module or creates global window.JXON object.

Implementation of Mozilla's [JXON](https://developer.mozilla.org/en-US/docs/JXON) code. Head over to MDN for [Documentation](https://developer.mozilla.org/en-US/docs/JXON#Usage).

Without changing the configuration, the library will work as original implementation.

### JXON.config(cnf)
**Overrides default configuration properties**
- cnf - Object with configuration properties.

Example:

```js
JXON.config({
  valueKey: '_',        // default: 'keyValue'
  attrKey: '$',         // default: 'keyAttributes'
  attrPrefix: '$',      // default: '@'
  lowerCaseTags: false, // default: true
  trueIsEmpty: false,   // default: true
  autoDate: false       // default: true
});
```

Conversion example:

```js
{name: 'myportal'} 
<name>myportal</name>

{user: {
    username: 'testUser1',
    password: 'yolo',
    enabled: true
}}
<user>
  <username>testUser1</username>
  <password>yolo</password>
  <enabled>true</enabled>
</user>

{tag: {
    $type: 'regular'
    $blacklist: false
    _: 'Backbase'
}}
<tag type="regular" blacklist="false">Backbase</tag>

{dogs: {
    name: ['Charlie', {$nick: 'yes', _:'Mad Max'}]
}}
<dogs>
    <name>Charlie</name>
    <name nick="yes">Mad Max</name>
</dogs>
```

### JXON.stringToJs(xmlString)
**Converts XML string to JS object.**
- xmlString - XML string to convert to JXON notation JS object

### JXON.jsToString(obj)
**Converts JS object to XML string.**
- obj - JS object in JXON notation to convert to XML string

### JXON.build(xmlDocument, verbosity, freeze, nestedAttributes)
**Converts XML document to JS object. _Alias: JXON.xmlToJs_**
- xmlDocument - The XML document to be converted into JavaScript Object.
- verbosity - Optional verbosity level of conversion, from 0 to 3. It is almost equivalent to our algorithms from #4 to #1 (default value is 1, which is equivalent to the algorithm #3).
- freeze - Optional boolean expressing whether the created object must be freezed or not (default value is false).
- nestedAttributes - Optional boolean expressing whether the the nodeAttributes must be nested into a child-object named keyAttributes or not (default value is false for verbosity levels from 0 to 2; true for verbosity level 3).
 
Example:
```js
var myObject = JXON.build(xmlDoc);
```
### JXON.unbuild(obj, namespaceURI, qualifiedNameStr, documentType)
**Converts JS object to XML document. _Alias: JXON.jsToXml_**
- obj - The JavaScript Object from which you want to create your XML Document.
- namespaceURI - Optional DOMString containing the namespace URI of the document to be created, or null if the document doesn't belong to one.
- qualifiedNameStr - Optional DOMString containing the qualified name, that is an optional prefix and colon plus the local root element name, of the document to be created.
- documentType - Optional DocumentType of the document to be created. It defaults to null.
 
Example:
```js
var myObject = JXON.unbuild(myObject);
```

### JXON.stringToXml(xmlString)
**Implementation of DOMParser.parseFromString, converts string to XML document.**
- xmlString - XML string to convert to XML document

### JXON.xmlToString(xmlObj)
**Implementation of XMLSerializer.serializeToString, converts XML document to string.**
- xmlObj - XML document to convert to XML string
