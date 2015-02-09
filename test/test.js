var assert = require("assert"),
    fs = require('fs'),
    jxon = require('../index'),
    xmlString = fs.readFileSync('./test/example.xml','utf8'),
    jsObj = {
        root: {
            $attr: 'value',
            _: 'root value'
        }
    };

jxon.config({
  valueKey: '_',        // default: 'keyValue'
  attrKey: '$',         // default: 'keyAttributes'
  attrPrefix: '$',      // default: '@'
  lowerCaseTags: false, // default: true
  trueIsEmpty: false,   // default: true
  autoDate: false,      // default: true
  ignorePrefixedNodes: false // default: true
});

describe('jxon', function(){
    describe('.jsToXml > .xmlToJs', function(){
        it('should return return identical object', function() {
            var xml = jxon.jsToXml(jsObj);
            var newJs = jxon.xmlToJs(xml);
            assert.deepEqual(jsObj, newJs);
        })
    })
    describe('.jsToString > .stringToJs', function(){
        it('should return return identical object', function() {
            var str = jxon.jsToString(jsObj);
            var newJs = jxon.stringToJs(str);
            assert.deepEqual(jsObj, newJs);
        })
    })
    describe('.stringToJs > .jsToString > .stringToJs', function(){
        it('should return return identical object', function() {
            var obj1 = jxon.stringToJs(xmlString),
                obj2 = jxon.stringToJs(jxon.jsToString(obj1));
            assert.deepEqual(obj1, obj2);
        })
    })
})
