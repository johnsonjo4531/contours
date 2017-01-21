(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.contours = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // from mdn
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  // from mdn
  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';

      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  if (!Object.entries) {
    Object.entries = function (obj) {
      return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
      });
    };
  }

  var contours = function contour() {
    var CONTOURS_ATTRIBUTES_KEY = "__contours_attributes__",
        CONTOURS_ATTRIBUTES_TEMP_ATTR = "data-contours-attrs",
        CONTOURS_UNIQUE_CLASS = "contours-shouldBeUnique",
        CONTOURS_NONESCAPING_HTML_KEY = "__contours_nonEscapingHTML__";
    var jQueryTemp = typeof jQuery !== "undefined" ? jQuery : function noJQuery() {};

    // var __entityMap = {
    //     "&": "&amp;",
    //     "<": "&lt;",
    //     ">": "&gt;",
    //     '"': '&quot;',
    //     "'": '&#39;',
    //     "/": '&#x2F;'
    // };
    //
    // function escapeHTML (str) {
    //     return str.replace(/[&<>"'\/]/g, function (s) {
    //         return __entityMap[s];
    //     });
    // }

    function escapeHTML(str) {
      // this is a basic parser
      var b = "";
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (c == "&") b += "&amp;";else if (c == "<") b += "&lt;";else if (c == ">") b += "&gt;";else if (c == '"') b += "&quot;";else if (c == "'") b += "&#39;";else if (c == "/") b += "&#x2F;";else b += c;
      }
      return b;
    }

    function parseHTML(markup) {
      markup = markup.trim();
      var el = document.createElement("template");
      el.innerHTML = markup;
      return el.content.childNodes;
    }

    function getReplaceText(strings, index) {
      return '<template class="' + CONTOURS_UNIQUE_CLASS + '"></template>';
    }

    function getNode(nodeValues, attributeValues, value, strings, index) {
      var i,
          html = "";
      if (value || value === 0) {
        if (value instanceof Node) {
          // value is a dom node 
          // replace it in the string with a temporary template node
          html += getReplaceText(strings, index);
          nodeValues.push(value);
        } else if (value instanceof jQueryTemp) {
          // value is jQuery element
          // replace it in the string with a temporary template node
          html += getReplaceText(strings, index);
          nodeValues.push(value);
        } else if (Array.isArray(value)) {
          // value is Array element
          // call getNode recursively for each element of the array.
          for (i = 0; i < value.length; ++i) {
            html += getNode(nodeValues, attributeValues, value[i], strings, index);
          }
        } else if (value instanceof NodeList || value instanceof HTMLCollection) {
          // value is some form of NodeList
          // call getNode recursively for each element
          value = [].slice.call(value);
          for (i = 0; i < value.length; ++i) {
            html += getNode(nodeValues, attributeValues, value[i], strings, index);
          }
        } else if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object") {
          // checking for special contours objects which have
          // special keys on them
          if (value[CONTOURS_ATTRIBUTES_KEY]) {
            // add an attribute placeholder to html element at current location in string
            // it's up to the user to guarantee that they
            // have a valid placement
            html += " " + CONTOURS_ATTRIBUTES_TEMP_ATTR + " ";
            delete value[CONTOURS_ATTRIBUTES_KEY];
            attributeValues.push(value);
          } else if (value[CONTOURS_NONESCAPING_HTML_KEY]) {
            // makes the value injectable html 
            // WARNING: this is not safe...
            html += value.val;
          }
        } else {
          // escape value otherwise
          html += contours.escapeHTML("" + value);
        }
      }
      return html;
    }

    function DOMTemplate(strings, values) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // this is contours main function
      // DOMTemplate goes through a string building process
      // then a linking process to link values that can't be
      // added with pure strings like DOM elements and the like
      var defaults = {
        includeScripts: false
      };

      options = Object.assign({}, defaults, options);

      var html = '',
          nodeValues = [],
          attributeValues = [],
          node = void 0,
          nodes = void 0,
          replaceNodes = void 0,
          replace = void 0,
          replacement = void 0;

      // string building process
      var i = void 0;
      for (i = 0; i < values.length; ++i) {
        var string = strings[i];
        var value = values[i];
        var prev2Chars = string.slice(-2);
        if (prev2Chars == "$#") {
          // add the value as a text node at current string location
          // it's up to the user to guarantee that they
          // have a valid placement
          value = contours.textNode(value);
          string = string.slice(0, -2);
        } else if (prev2Chars == "$@") {
          // add the value as an attribute to the element at current string location
          // it's up to the user to guarantee that they
          // have a valid placement
          value = contours.attributes(value);
          string = string.slice(0, -2);
        } else if (prev2Chars == "$*") {
          // makes the value injectable html 
          // WARNING: this is not safe...
          value = contours.nonEscapingHTML(value);
          string = string.slice(0, -2);
        } else if (string.slice(-1) == "$") {
          // escaping is the default now but make sure its a string
          // so it gets escaped
          value = "" + value;
          string = string.slice(0, -1);
        }

        html += string;

        html += getNode(nodeValues, attributeValues, value, strings, i);
      }
      html += strings[i];

      // linking process:
      // This creates the html and traverses it
      // adding in the values given by the user.
      nodes = parseHTML(html);
      var arrNodes = [].slice.call(nodes);
      for (var _i = 0; _i < nodes.length; ++_i) {
        traverseDOM(arrNodes[_i], nodeValues.slice(), attributeValues.slice(), options);
      }
      var fragment = document.createDocumentFragment();
      var length = nodes.length;
      for (var _i2 = 0; _i2 < length; ++_i2) {
        fragment.appendChild(nodes[0]);
      }
      return fragment;
    }

    function traverseDOM(node, nodeValues, attributeValues, options) {
      var notReplaced = true;
      var replacement;
      if (attributeValues.length === 0 && nodeValues.length === 0 && !options.includeScripts) {
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.className === CONTOURS_UNIQUE_CLASS) {
          if (nodeValues.length > 0) {
            replacement = nodeValues.shift();
            if (replacement instanceof jQueryTemp) {
              jQueryTemp(node).replaceWith(replacement);
            } else {
              node.parentNode.replaceChild(replacement, node);
            }
          }
        } else {
          if (node.hasAttribute(CONTOURS_ATTRIBUTES_TEMP_ATTR)) {
            if (attributeValues.length > 0) {
              setAttributes(node, attributeValues.shift());
              node.removeAttribute(CONTOURS_ATTRIBUTES_TEMP_ATTR);
            }
          }
          if (options.includeScripts && (node.tagName || "").toUpperCase() === 'SCRIPT') {
            node.parentNode.replaceChild(nodeScriptClone(node), node);
          }
        }

        if (notReplaced) {
          var i = 0;
          var children = node.childNodes;
          while (i < children.length) {
            traverseDOM(children[i++], nodeValues, attributeValues, options);
          }
        }
      }
    }

    function nodeScriptClone(node) {
      var script = document.createElement("script");
      script.text = node.innerHTML;
      for (var i = node.attributes.length - 1; i >= 0; i--) {
        script.setAttribute(node.attributes[i].name, node.attributes[i].value);
      }
      return script;
    }

    function setAttributesAll(nodes, attributeValues) {
      var j = 0;
      nodes.forEach(function (el) {
        if (typeof el.getElementsByClassName === "function") {
          j;
          var uniqueEls = [].slice.call(el.querySelectorAll('[' + CONTOURS_ATTRIBUTES_TEMP_TXT + ']'));
          if (el.hasAttribute(CONTOURS_ATTRIBUTES_TEMP_TXT)) {
            uniqueEls.push(el);
          }
          for (var i = 0; i < uniqueEls.length; ++i, ++j) {
            setAttributes(uniqueEls[i], attributeValues[j]);
            uniqueEls[i].removeAttribute(CONTOURS_ATTRIBUTES_TEMP_TXT);
          }
        }
      });
    }

    function partition(list, cb) {
      if (typeof cb === "function") {
        var i;

        var _ret = function () {
          var results = [];
          results.push([]);
          results.push([]);

          var testPassing = function testPassing(condition, val) {
            if (condition) {
              results[0].push(val);
            } else {
              results[1].push(val);
            }
          };

          if ((typeof list === 'undefined' ? 'undefined' : _typeof(list)) === "object" && !Array.isArray(list)) {
            Object.keys(list).forEach(function (key) {
              var obj = {};
              obj[key] = list[key];
              testPassing(cb(list[key], key, list), obj);
            });
          } else {
            for (i = 0; i < list.length; ++i) {
              testPassing(cb(list[i], i, list), list[i]);
            }
          }
          return {
            v: results
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }

    var fromCamelToKabobCase = function fromCamelToKabobCase(str) {
      return str.replace(/([A-Z])/g, "-$1").toLowerCase();
    };

    function setAttributes(elNode) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var style, styleString;
      if (attributes.style && _typeof(attributes.style) === "object") {
        style = attributes.style;
        delete attributes.style;
        styleString = Object.keys(style).map(function (key) {
          return fromCamelToKabobCase(key) + ': ' + style[key] + ';';
        }).join(" ");
        elNode.setAttribute("style", styleString);
      }
      var allAttributes = Object.entries(attributes);
      for (var i = 0; i < allAttributes.length; ++i) {
        var _allAttributes$i = _slicedToArray(allAttributes[i], 2),
            key = _allAttributes$i[0],
            val = _allAttributes$i[1];

        if (/^on/.test(key)) {
          if (typeof val === "function") {
            elNode.addEventListener(key.replace(/^on/, ""), val);
          } else {
            console.warn(key + " property does not have a function for a value");
          }
        } else {
          try {
            elNode.setAttribute(key, val);
          } catch (e) {
            console.warn(e);
          }
        }
      }

      return elNode;
    }

    function _contours(html) {
      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      return DOMTemplate(html, values);
    }

    function custom(options) {
      return function _contoursCustom(html) {
        for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          values[_key2 - 1] = arguments[_key2];
        }

        return DOMTemplate(html, values, options);
      };
    }

    function attributes(obj) {
      return Object.assign({}, obj, _defineProperty({}, CONTOURS_ATTRIBUTES_KEY, true));
    }

    function nonEscapingHTML() {
      var _ref;

      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      return _ref = {}, _defineProperty(_ref, CONTOURS_NONESCAPING_HTML_KEY, true), _defineProperty(_ref, 'val', val), _ref;
    }

    // we're giving the contours function some extra properties.
    return Object.assign(_contours, {
      escapeHTML: escapeHTML,
      nonEscapingHTML: nonEscapingHTML,
      textNode: function textNode(text) {
        return document.createTextNode(text);
      },
      custom: custom,
      attributes: attributes
    });
  }();

  exports.default = contours;
  var escapeHTML = contours.escapeHTML,
      textNode = contours.textNode,
      custom = contours.custom,
      attributes = contours.attributes;
  exports.escapeHTML = escapeHTML;
  exports.textNode = textNode;
  exports.custom = custom;
  exports.attributes = attributes;
});