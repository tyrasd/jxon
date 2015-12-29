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
  valueKey: '_',                // default: 'keyValue'
  attrKey: '$',                 // default: 'keyAttributes'
  attrPrefix: '$',              // default: '@'
  lowerCaseTags: false,         // default: true
  trueIsEmpty: false,           // default: true
  autoDate: false,              // default: true
  ignorePrefixedNodes: false,   // default: true
  parseValues: false            // default: true
});

describe('jxon', function(){
    describe('.jsToXml > .xmlToJs', function(){
        it('should return return identical object', function() {
            var xml = jxon.jsToXml(jsObj);
            var newJs = jxon.xmlToJs(xml);
            assert.deepEqual(jsObj, newJs);
        });
    });
    describe('.jsToString > .stringToJs', function(){
        it('should return return identical object', function() {
            var str = jxon.jsToString(jsObj);
            var newJs = jxon.stringToJs(str);
            assert.deepEqual(jsObj, newJs);
        });
    });
    describe('.stringToJs > .jsToString > .stringToJs', function(){
        it('should return return identical object', function() {
            var obj1 = jxon.stringToJs(xmlString),
                obj2 = jxon.stringToJs(jxon.jsToString(obj1));
            assert.deepEqual(obj1, obj2);
        });
    });
    describe('empty nodes should be empty when trueIsEmpty = false', function(){
        it('<empty/> should remain empty', function() {
            var jx = jxon.stringToJs('<empty/>');
            assert.equal(jx.empty, '');
        });
        it('<empty></empty> should remain empty', function() {
            var jx = jxon.stringToJs('<empty></empty>');
            assert.equal(jx.empty, '');
        });
    });
    describe('parseValues option', function(){
        it('11.0 should remain string', function() {
            var jx = jxon.stringToJs('<float>11.0</float>');
            assert.ok(jx.float.indexOf('.0') !== -1);
        });
    });
    describe('json treatment', function(){
        it('treat null values equally as empty objects', function() {
            var strNull = jxon.jsToString({element: {a: null }});
            var strEmptyObj = jxon.jsToString({element: {a: {} }});
            assert.equal(strNull, strEmptyObj);
        });
    });
})
