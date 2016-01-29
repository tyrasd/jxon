if (typeof require !== 'undefined') {
    var assert = require('chai').assert;
    var JXON = require('../index');
}

var xmlString = '<?xml version=\"1.0\"?>\n<!DOCTYPE catalog SYSTEM \"catalog.dtd\">\n<catalog>\n  <product description=\"Cardigan Sweater\">\n   <catalog_item gender=\"Men\'s\">\n     <item_number>QWZ5671<\/item_number>\n     <price>39.95<\/price>\n     <size description=\"Medium\">\n       <color_swatch image=\"red_cardigan.jpg\">Red<\/color_swatch>\n       <color_swatch image=\"burgundy_cardigan.jpg\">Burgundy<\/color_swatch>\n     <\/size>\n     <size description=\"Large\">\n       <color_swatch image=\"red_cardigan.jpg\">Red<\/color_swatch>\n       <color_swatch image=\"burgundy_cardigan.jpg\">Burgundy<\/color_swatch>\n     <\/size>\n   <\/catalog_item>\n   <catalog_item gender=\"Women\'s\">\n     <item_number>RRX9856<\/item_number>\n     <discount_until>Dec 25, 1995<\/discount_until>\n     <price>42.50<\/price>\n     <size description=\"Medium\">\n       <color_swatch image=\"black_cardigan.jpg\">Black<\/color_swatch>\n     <\/size>\n   <\/catalog_item>\n  <\/product>\n  <script type=\"text\/javascript\"><![CDATA[function matchwo(a,b) {\n    if (a < b && a < 0) { return 1; }\n    else { return 0; }\n}]]><\/script>\n<\/catalog>';
var jsObj = {
        root: {
            $attr: 'value',
            _: 'root value'
        }
    };

describe('jxon', function(){
    describe('.jsToXml > .xmlToJs', function(){
        it('should return return identical object', function() {
            var xml = JXON.jsToXml(jsObj);
            var newJs = JXON.xmlToJs(xml);
            assert.deepEqual(jsObj, newJs);
        });
    });
    describe('.jsToString > .stringToJs', function(){
        it('should return return identical object', function() {
            var str = JXON.jsToString(jsObj);
            var newJs = JXON.stringToJs(str);
            assert.deepEqual(jsObj, newJs);
        });
        it('should parse xmlns', function() {
            var obj = {
                test: {
                    '$xmlns': 'foo',
                    '$xmlns:y': 'moo'
                }
            };
            var str = JXON.jsToString(obj);
            assert.equal(str, '<test xmlns="foo" xmlns:y="moo"/>');
        });
    });
    describe('.stringToJs > .jsToString > .stringToJs', function(){
        it('should return return identical object', function() {
            var obj1 = JXON.stringToJs(xmlString),
                obj2 = JXON.stringToJs(JXON.jsToString(obj1));
            assert.deepEqual(obj1, obj2);
        });
    });
    describe('empty nodes should be empty when trueIsEmpty = false', function(){
        it('<empty/> should remain empty', function() {
            var jx = JXON.stringToJs('<empty/>');
            assert.equal(jx.empty, '');
        });
        it('<empty></empty> should remain empty', function() {
            var jx = JXON.stringToJs('<empty></empty>');
            assert.equal(jx.empty, '');
        });
    });
    describe('parseValues option', function(){
        it('11.0 should remain string', function() {
            var jx = JXON.stringToJs('<float>11.0</float>');
            assert.ok(jx.float.indexOf('.0') !== -1);
        });
    });
    describe('json treatment', function(){
        it('treat null values equally as empty objects', function() {
            var strNull = JXON.jsToString({element: {a: null }});
            var strEmptyObj = JXON.jsToString({element: {a: {} }});
            assert.equal(strNull, strEmptyObj);
        });
    });
    describe('.each', function(){
        it('one node should iterate', function() {
            var jx = JXON.stringToJs('<val>foo</val>');
            JXON.each(jx.val, function(val) {
                assert(val, 'foo');
            });
        });
        it('multiple nodes should iterate', function() {
            var jx = JXON.stringToJs('<val>foo</val><val>foo</val>');
            JXON.each(jx.val, function(val) {
                assert(val, 'foo');
            });
        });
    });
})
