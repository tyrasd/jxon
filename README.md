JXON [![Build Status](https://secure.travis-ci.org/tyrasd/jxon.svg)](https://travis-ci.org/tyrasd/jxon)
====

A complete, bidirectional, JXON (lossless JavaScript XML Object Notation) library. Packed as UMD.

Implementation of Mozilla's [JXON](https://developer.mozilla.org/en-US/docs/JXON) code. Head over to MDN for [Documentation](https://developer.mozilla.org/en-US/docs/JXON#Usage).


#### Example:

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

# API

### .config(cnf)
**Overrides default configuration properties**
- cnf - Object with configuration properties.

_Defaults:_

```js
valueKey: '_',
attrKey: '$',
attrPrefix: '$',
lowerCaseTags: false,
trueIsEmpty: false,
autoDate: false,
ignorePrefixedNodes: false,
parseValues: false,
parserErrorHandler: undefined
```

### .stringToJs(xmlString)
**Converts XML string to JS object.**
- xmlString - XML string to convert to JXON notation JS object

### .jsToString(obj)
**Converts JS object to XML string.**
- obj - JS object in JXON notation to convert to XML string

### .xmlToJs(xmlDocument, verbosity, freeze, nestedAttributes)
**Converts XML document to JS object. _Alias: JXON.build_**
- xmlDocument - The XML document to be converted into JavaScript Object.
- verbosity - Optional verbosity level of conversion, from 0 to 3. It is almost equivalent to our algorithms from #4 to #1 (default value is 1, which is equivalent to the algorithm #3).
- freeze - Optional boolean expressing whether the created object must be freezed or not (default value is false).
- nestedAttributes - Optional boolean expressing whether the the nodeAttributes must be nested into a child-object named keyAttributes or not (default value is false for verbosity levels from 0 to 2; true for verbosity level 3).
 
Example:
```js
var myObject = JXON.build(xmlDoc);
```
### .jsToXml(obj, namespaceURI, qualifiedNameStr, documentType)
**Converts JS object to XML document. _Alias: JXON.unbuild_**
- obj - The JavaScript Object from which you want to create your XML Document.
- namespaceURI - Optional DOMString containing the namespace URI of the document to be created, or null if the document doesn't belong to one.
- qualifiedNameStr - Optional DOMString containing the qualified name, that is an optional prefix and colon plus the local root element name, of the document to be created.
- documentType - Optional DocumentType of the document to be created. It defaults to null.
 
Example:
```js
var myObject = JXON.unbuild(myObject);
```

### .stringToXml(xmlString)
**Wrapper over DOMParser.parseFromString, converts string to XML document.**
- xmlString - XML string to convert to XML document

### .xmlToString(xmlObj)
**Wrapper over XMLSerializer.serializeToString, converts XML document to string.**
- xmlObj - XML document to convert to XML string

### .each(obj, callback[, thisArg])
**Helper method to iterate node(s).**  
In case that there is only one children node, JXON will return object. For multiple children it will return array. This method will always iterate nodes as array.
- obj - array or object to iterate
- callback - function to execute for each element
- thisArg - optional. Value to use as this when eecuting callback

Example:
```js
var jx = jxon.stringToJs('<val>foo</val>');
jxon.each(jx.val, function(val) {
    assert(val, 'foo');
});
```

# CHANGELOG

## 2.0.0

changes from version 1.x to 2.0 include:

* (breaking) more usefull default settings (see above)
* (breaking) stringify Dates to ISO format instead of GMT
* improved xml namespace handling on node and browsers
* renamed main source file to `jxon.js`
