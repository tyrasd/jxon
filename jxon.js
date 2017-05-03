/*
 * JXON framework - Copyleft 2011 by Mozilla Developer Network
 *
 * Revision #1 - September 5, 2014
 *
 * https://developer.mozilla.org/en-US/docs/JXON
 *
 * This framework is released under the GNU Public License, version 3 or later.
 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
 *
 * small modifications performed by the iD project:
 * https://github.com/openstreetmap/iD/commits/18aa33ba97b52cacf454e95c65d154000e052a1f/js/lib/jxon.js
 *
 * small modifications performed by user @bugreport0
 * https://github.com/tyrasd/JXON/pull/2/commits
 *
 * some additions and modifications by user @igord
 * https://github.com/tyrasd/JXON/pull/5/commits
 *
 * bugfixes and code cleanup by user @laubstein
 * https://github.com/tyrasd/jxon/pull/32
 *
 * adapted for nodejs and npm by @tyrasd (Martin Raifer <tyr.asd@gmail.com>)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory(window));
  } else if (typeof exports === 'object') {
    if (typeof window === 'object' && window.DOMImplementation && window.XMLSerializer && window.DOMParser) {
      // Browserify. hardcode usage of browser's own XMLDom implementation
      // see https://github.com/tyrasd/jxon/issues/18

      module.exports = factory(window);
    } else {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.

      module.exports = factory(require('xmldom'), true);
    }
  } else {
    // Browser globals (root is window)

    root.JXON = factory(window);
  }
}(this, function(xmlDom, isNodeJs) {
  var opts = {
    valueKey: '_',
    attrKey: '$',
    attrPrefix: '$',
    lowerCaseTags: false,
    trueIsEmpty: false,
    autoDate: false,
    ignorePrefixedNodes: false,
    parseValues: false,
    sequenceKey: '_sequence'
  };
  var aCache = [];
  var rIsNull = /^\s*$/;
  var rIsBool = /^(?:true|false)$/i;
  var DOMParser;

  return new (function() {

    this.config = function(cfg) {
      for (var k in cfg) {

        opts[k] = cfg[k];
      }
      if (opts.parserErrorHandler) {
        DOMParser = new xmlDom.DOMParser({
          errorHandler: opts.parserErrorHandler,
          locator: {}
        });
      }
    };

    function parseText(sValue) {
      if (!opts.parseValues) {
        return sValue;
      }

      if (rIsNull.test(sValue)) {
        return null;
      }

      if (rIsBool.test(sValue)) {
        return sValue.toLowerCase() === 'true';
      }

      if (isFinite(sValue)) {
        return parseFloat(sValue);
      }

      if (opts.autoDate && isFinite(Date.parse(sValue))) {
        return new Date(sValue);
      }

      return sValue;
    }
    function EmptyTree() {
    }
    EmptyTree.prototype.toString = function() {
      return 'null';
    };

    EmptyTree.prototype.valueOf = function() {
      return null;
    };

    function objectify(vValue) {
      return vValue === null ? new EmptyTree() : vValue instanceof Object ? vValue : new vValue.constructor(vValue);
    }

    function createObjTree(oParentNode, nVerb, bFreeze, bNesteAttr) {
      var CDATA = 4,
        TEXT = 3,
        ELEMENT = 1,
        nLevelStart = aCache.length,
        bChildren = oParentNode.hasChildNodes(),
        bAttributes = oParentNode.nodeType === oParentNode.ELEMENT_NODE && oParentNode.hasAttributes(),
        bHighVerb = Boolean(nVerb & 2),
        nLength = 0,
        sCollectedTxt = '',
        vResult = bHighVerb ? {} : /* put here the default value for empty nodes: */ (opts.trueIsEmpty ? true : ''),
        sProp,
        vContent;

      if (bChildren) {
        for (var oNode, nItem = 0; nItem < oParentNode.childNodes.length; nItem++) {

          oNode = oParentNode.childNodes.item(nItem);
          if (oNode.nodeType === CDATA) {
            sCollectedTxt += oNode.nodeValue;
          } /* nodeType is "CDATASection" (4) */
          else if (oNode.nodeType === TEXT) {
            sCollectedTxt += oNode.nodeValue.trim();
          } /* nodeType is "Text" (3) */
          else if (oNode.nodeType === ELEMENT && !(opts.ignorePrefixedNodes && oNode.prefix)) {
            aCache.push(oNode);
          }
        /* nodeType is "Element" (1) */
        }
      }

      var nLevelEnd = aCache.length,
        vBuiltVal = parseText(sCollectedTxt);

      if (!bHighVerb && (bChildren || bAttributes)) {
        vResult = nVerb === 0 ? objectify(vBuiltVal) : {};
      }

      for (var nElId = nLevelStart; nElId < nLevelEnd; nElId++) {

        sProp = aCache[nElId].nodeName;
        if (opts.lowerCaseTags) {
          sProp = sProp.toLowerCase();
        }

        vContent = createObjTree(aCache[nElId], nVerb, bFreeze, bNesteAttr);
        if (vResult.hasOwnProperty(sProp)) {
          if (vResult[sProp].constructor !== Array) {
            vResult[sProp] = [vResult[sProp]];
          }

          vResult[sProp].push(vContent);
        } else {
          vResult[sProp] = vContent;

          nLength++;
        }
      }

      if (bAttributes) {
        var nAttrLen = oParentNode.attributes.length,
          sAPrefix = bNesteAttr ? '' : opts.attrPrefix,
          oAttrParent = bNesteAttr ? {} : vResult;

        for (var oAttrib, oAttribName, nAttrib = 0; nAttrib < nAttrLen; nLength++, nAttrib++) {

          oAttrib = oParentNode.attributes.item(nAttrib);

          oAttribName = oAttrib.name;
          if (opts.lowerCaseTags) {
            oAttribName = oAttribName.toLowerCase();
          }

          oAttrParent[sAPrefix + oAttribName] = parseText(oAttrib.value.trim());
        }

        if (bNesteAttr) {
          if (bFreeze) {
            Object.freeze(oAttrParent);
          }

          vResult[opts.attrKey] = oAttrParent;

          nLength -= nAttrLen - 1;
        }

      }

      if (nVerb === 3 || (nVerb === 2 || nVerb === 1 && nLength > 0) && sCollectedTxt) {
        vResult[opts.valueKey] = vBuiltVal;
      } else if (!bHighVerb && nLength === 0 && sCollectedTxt) {
        vResult = vBuiltVal;
      }
      if (bFreeze && (bHighVerb || nLength > 0)) {
        Object.freeze(vResult);
      }

      aCache.length = nLevelStart;

      return vResult;
    }
    function loadObjTree(oXMLDoc, oParentEl, oParentObj) {
      var vValue,
        oChild,
        elementNS;

      if (oParentObj.constructor === String || oParentObj.constructor === Number || oParentObj.constructor === Boolean) {
        oParentEl.appendChild(oXMLDoc.createTextNode(oParentObj.toString())); /* verbosity level is 0 or 1 */
        if (oParentObj === oParentObj.valueOf()) {
          return;
        }

      } else if (oParentObj.constructor === Date) {
        oParentEl.appendChild(oXMLDoc.createTextNode(oParentObj.toISOString()));
      }

      // Pull out properties names
      var propNames = Object.getOwnPropertyNames(oParentObj);

      // Look for optional _sequence
      if (oParentObj.hasOwnProperty(opts.sequenceKey)) {

        var sequence = oParentObj[opts.sequenceKey];

        // sort prop names based on _sequence
        propNames.sort(function(a, b) {

          // Sort comparator
          // find index of A and B
          var aIndex = sequence.indexOf(a);
          var bIndex = sequence.indexOf(b);

          // If prop not named, put on end
          if (aIndex < 0 || bIndex < 0) {
            return -1;
          }

          // Subtract the indexes
          return aIndex - bIndex;
        })

      }

      propNames.forEach(function(sName, index) {

        vValue = oParentObj[sName];
        if ( vValue === undefined ) {
          return;
        }
        if ( vValue === null ) {
          vValue = {};
        }
        if ( sName === opts.sequenceKey) {
          return;
        }

        if (isFinite(sName) || vValue instanceof Function) {
          return;
        }

        /* verbosity level is 0 */
        if (sName === opts.valueKey) {
          if (vValue !== null && vValue !== true) {
            oParentEl.appendChild(oXMLDoc.createTextNode(vValue.constructor === Date ? vValue.toISOString() : String(vValue)));
          }

        } else if (sName === opts.attrKey) { /* verbosity level is 3 */
          for (var sAttrib in vValue) {
            oParentEl.setAttribute(sAttrib, vValue[sAttrib]);
          }
        } else if (sName === opts.attrPrefix + 'xmlns') {
          if (isNodeJs) {
            oParentEl.setAttribute(sName.slice(1), vValue);
          }
        // do nothing: special handling of xml namespaces is done via createElementNS()
        } else if (sName.charAt(0) === opts.attrPrefix) {
          oParentEl.setAttribute(sName.slice(1), vValue);
        } else if (vValue.constructor === Array) {
          for (var nItem in vValue) {
            if (!vValue.hasOwnProperty(nItem)) continue;
            elementNS = (vValue[nItem] && vValue[nItem][opts.attrPrefix + 'xmlns']) || oParentEl.namespaceURI;
            if (elementNS) {
              oChild = oXMLDoc.createElementNS(elementNS, sName);
            } else {
              oChild = oXMLDoc.createElement(sName);
            }

            loadObjTree(oXMLDoc, oChild, vValue[nItem] || {});
            oParentEl.appendChild(oChild);
          }
        } else {
          elementNS = (vValue || {})[opts.attrPrefix + 'xmlns'] || oParentEl.namespaceURI;
          if (elementNS) {
            oChild = oXMLDoc.createElementNS(elementNS, sName);
          } else {
            oChild = oXMLDoc.createElement(sName);
          }
          if (vValue instanceof Object) {
            loadObjTree(oXMLDoc, oChild, vValue);
          } else if (vValue !== null && (vValue !== true || !opts.trueIsEmpty)) {
            oChild.appendChild(oXMLDoc.createTextNode(vValue.toString()));
          }
          oParentEl.appendChild(oChild);
        }
      });
    }
    this.xmlToJs = this.build = function(oXMLParent, nVerbosity /* optional */ , bFreeze /* optional */ , bNesteAttributes /* optional */ ) {
      var _nVerb = arguments.length > 1 && typeof nVerbosity === 'number' ? nVerbosity & 3 : /* put here the default verbosity level: */ 1;
      return createObjTree(oXMLParent, _nVerb, bFreeze || false, arguments.length > 3 ? bNesteAttributes : _nVerb === 3);
    };

    this.jsToXml = this.unbuild = function(oObjTree, sNamespaceURI /* optional */ , sQualifiedName /* optional */ , oDocumentType /* optional */ ) {
      var documentImplementation = xmlDom.document && xmlDom.document.implementation || new xmlDom.DOMImplementation();
      var oNewDoc = documentImplementation.createDocument(sNamespaceURI || null, sQualifiedName || '', oDocumentType || null);
      loadObjTree(oNewDoc, oNewDoc.documentElement || oNewDoc, oObjTree);
      return oNewDoc;
    };

    this.stringToXml = function(xmlStr) {
      if (!DOMParser) {
        DOMParser = new xmlDom.DOMParser();
      }

      return DOMParser.parseFromString(xmlStr, 'application/xml');
    };

    this.xmlToString = function(xmlObj) {
      if (typeof xmlObj.xml !== 'undefined') {
        return xmlObj.xml;
      } else {
        return (new xmlDom.XMLSerializer()).serializeToString(xmlObj);
      }
    };

    this.stringToJs = function(str) {
      var xmlObj = this.stringToXml(str);
      return this.xmlToJs(xmlObj);
    };

    this.jsToString = this.stringify = function(oObjTree, sNamespaceURI /* optional */ , sQualifiedName /* optional */ , oDocumentType /* optional */ ) {
      return this.xmlToString(
        this.jsToXml(oObjTree, sNamespaceURI, sQualifiedName, oDocumentType)
      );
    };

    this.each = function(arr, func, thisArg) {
      if (arr instanceof Array) {
        arr.forEach(func, thisArg);
      } else {
        [arr].forEach(func, thisArg);
      }
    };
  })();

}

));
