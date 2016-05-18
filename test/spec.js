var assert = require("assert"),
    fs = require('fs'),
    JXON = require('../jxon'),
    xmlString = require('./example.xml.json'),
    jsObj = {
        root: {
            $attr: 'value',
            _: 'root value'
        }
    };


describe('JXON', function(){
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
    describe('xml namespaces', function(){
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
        it('as property', function() { // addigional test from #26
            var strNull = JXON.jsToString({
              'TrainingCenterDatabase': {
                '$xmlns:ns2': '1',
                '$xmlns:xsi': '2',
                '$xmlns:ns4': '3',
                '$xmlns:ns5': '4',
                '$xmlns:tpx': '5',
                '$xmlns': '6',
                'Activities': [],
                'Author': {
                  '$xsi:type': 'Application_t',
                  'Name': 'test',
                  'Build': {
                    'Version': {
                      'VersionMajor': 80
                    }
                  },
                  'LangID': 'en'
                }
              }
            });
            var strEmptyObj =
              '<TrainingCenterDatabase' +
                  ' xmlns:ns2="1"' +
                  ' xmlns:xsi="2"' +
                  ' xmlns:ns4="3"' +
                  ' xmlns:ns5="4"' +
                  ' xmlns:tpx="5"' +
                  ' xmlns="6">' +
                '<Author' +
                    ' xsi:type="Application_t">' +
                  '<Name>test</Name>' +
                  '<Build>' +
                    '<Version>' +
                      '<VersionMajor>80</VersionMajor>' +
                    '</Version>' +
                  '</Build>' +
                  '<LangID>en</LangID>' +
                '</Author>' +
              '</TrainingCenterDatabase>';
            assert.equal(strNull, strEmptyObj);
        });
    });
});
