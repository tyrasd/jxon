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
  autoDate: false       // default: true
});

describe('jxon', function(){
    describe('.stringToXml > .xmlToString', function(){
        it('should return return identical xmlString', function() {
            var xml = jxon.stringToXml(xmlString),
                str = jxon.xmlToString(xml);
            assert.equal(xmlString, str);
        })
    })
    describe('.jsToXml > .xmlToJs', function(){
        it('should return return identical object', function() {
            var xml = jxon.jsToXml(jsObj);
            var newJs = jxon.xmlToJs(xml);
            assert.deepEqual(jsObj, newJs);
        })
    })
})
