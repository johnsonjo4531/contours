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
    // added to objects to show that the object is meant to be an attributes object
    var CONTOURS_ATTRIBUTES_KEY = "__contours_attributes__",

    // temp attribute added to signify this element has attributes to be added
    CONTOURS_ATTRIBUTES_TEMP_ATTR = "data-contours-attrs",

    // a unique class used for pinpointing contours value placeholder elements
    CONTOURS_UNIQUE_CLASS = "contours-shouldBeUnique",

    // added to objects to show that the object is meant to be an hold escaped html
    CONTOURS_NONESCAPING_HTML_KEY = "__contours_nonEscapingHTML__",
        CONTOURS_HTML_STRING = "__contours_html_string__";
    var jQueryTemp = typeof jQuery !== "undefined" ? jQuery : function noJQuery() {};

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

    function appendFrag(nodes) {
      var fragment = document.createDocumentFragment();
      var length = nodes.length;
      for (var i = 0; i < length; ++i) {
        fragment.appendChild(nodes[0]);
      }
      return fragment;
    }

    function parseHTMLDocFrag(markup) {
      return appendFrag(parseHTML(markup));
    }

    function _toFrag(html, options) {
      var defaults = {
        scripts: false
      };
      options = Object.assign({}, defaults, options);
      var frag = void 0;
      if ((typeof html === 'undefined' ? 'undefined' : _typeof(html)) === "object" && html[CONTOURS_HTML_STRING]) {
        frag = parseHTMLDocFrag(html.data);
      } else if (typeof html === "string") {
        frag = parseHTMLDocFrag(html);
      } else {
        throw new Error("type should be a string or contours string");
      }
      if (options.scripts) {
        var scripts = [].slice.call(frag.childNodes).reduce(function (arr, node) {
          return arr.concat([].slice.call(node.getElementsByTagName("script")));
        }, []);
        scripts = [].slice.call(scripts);
        for (var i = 0; i < scripts.length; ++i) {
          enableScript(scripts[i]);
        }
      }
      return frag;
    }

    function getReplaceText(strings, index) {
      return '<template class="' + CONTOURS_UNIQUE_CLASS + '"></template>';
    }

    function getNode(nodeValues, attributeValues, value, strings, index) {
      var docFrag = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

      var i,
          html = "";
      if (value || value === 0) {
        if (value instanceof Node) {
          // value is a dom node 
          // replace it in the string with a temporary template node
          if (!docFrag) {
            html += getReplaceText(strings, index);
            nodeValues.push(value);
          } else {
            docFrag.appendChild(value);
          }
        } else if (value instanceof jQueryTemp) {
          // value is jQuery element
          // replace it in the string with a temporary template node
          if (!docFrag) {
            html += getReplaceText(strings, index);
            nodeValues.push(value);
          } else {
            value.appendTo(docFrag);
          }
        } else if (Array.isArray(value)) {
          // value is Array element
          // call getNode recursively for each element of the array.
          if (value.every(function (val) {
            return typeof val === 'string' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val[CONTOURS_HTML_STRING];
          })) {
            html += getHTMLForStringHTML(value);
            if (!docFrag) {
              return html;
            } else {
              docFrag.appendChild(parseHTMLDocFrag(html));
              return html;
            }
          }
          var frag = document.createDocumentFragment();
          for (i = 0; i < value.length; ++i) {
            html += getNode(nodeValues, attributeValues, value[i], strings, index, frag);
          }
          if (!docFrag) {
            html += getReplaceText(strings, index);
            nodeValues.push(frag);
          } else {
            docFrag.appendChild(frag);
          }
        } else if (value instanceof NodeList || value instanceof HTMLCollection) {
          // value is some form of NodeList
          // call getNode recursively for each element
          var _frag = document.createDocumentFragment();
          value = [].slice.call(value);
          if (!docFrag) {
            for (i = 0; i < value.length; ++i) {
              getNode(nodeValues, attributeValues, value[i], strings, index, _frag);
            }
            html += getReplaceText(strings, index);
            nodeValues.push(_frag);
          } else {
            docFrag.appendChild(_frag);
          }
        } else if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object") {
          // checking for special contours objects which have
          // special keys on them
          if (value[CONTOURS_ATTRIBUTES_KEY]) {
            // add an attribute placeholder to html element at current location in string
            // it's up to the user to guarantee that they
            // have a valid placement
            if (docFrag) {
              throw new Error("There shouldn't be a contours attribute in an array given to contours. Value given: " + JSON.stringify(value));
            }
            html += " " + CONTOURS_ATTRIBUTES_TEMP_ATTR + " ";
            delete value[CONTOURS_ATTRIBUTES_KEY];
            attributeValues.push(value);
          } else if (value[CONTOURS_NONESCAPING_HTML_KEY]) {
            // makes the value injectable html 
            // WARNING: this is not safe...
            if (docFrag) {
              throw new Error("There shouldn't be injectable HTML inside an array given to contours. Value given: " + JSON.stringify(value));
            }
            html += value.val;
          } else if (value[CONTOURS_HTML_STRING]) {
            if (!docFrag) {
              html += value.data;
            } else {
              docFrag.appendChild(parseHTMLDocFrag(value.data));
            }
          }
        } else {
          // escape value otherwise
          if (!docFrag) {
            html += escapeHTML("" + value);
          } else {
            docFrag.appendChild(document.createTextNode(value));
          }
        }
      }
      return html;
    }

    function getHTMLForStringHTML(values) {
      return values.reduce(function (html, val) {
        if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === "object" && val[CONTOURS_HTML_STRING]) {
          return html + val.data;
        } else {
          return html + escapeHTML(val);
        }
      }, "");
    }

    function safeHTML(strings) {
      var _ref;

      var html = "";
      var i = void 0;

      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      for (i = 0; i < values.length; ++i) {
        var string = strings[i];
        var value = values[i];
        var prev2Chars = string.slice(-2);
        if (prev2Chars == "$*") {
          // makes the value injectable html 
          // WARNING: this is not safe...
          string = string.slice(0, -2);
          // do nothing to value just let it be concatenated
        } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object" && value[CONTOURS_HTML_STRING]) {
          value = value.data;
        } else if (Array.isArray(value)) {
          value = getHTMLForStringHTML(value);
        } else {
          value = escapeHTML("" + value);
        }

        html += string;

        if (Array.isArray(value)) {
          for (var j = 0; i < value.length; ++i) {
            html += value;
          }
        } else {
          html += value;
        }
      }
      html += strings[i];

      return _ref = {}, _defineProperty(_ref, CONTOURS_HTML_STRING, true), _defineProperty(_ref, 'data', html), _defineProperty(_ref, 'toFrag', function toFrag(options) {
        return _toFrag(html, options);
      }), _ref;
    }

    function DOMTemplate(strings, values) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // this is contours main function
      // DOMTemplate goes through a string building process
      // then a linking process to link values that can't be
      // added with pure strings like DOM elements and the like
      var defaults = {
        scripts: false
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
          value = document.createTextNode(value);
          string = string.slice(0, -2);
        } else if (prev2Chars == "$@") {
          // add the value as an attribute to the element at current string location
          // it's up to the user to guarantee that they
          // have a valid placement
          value = attributes(value);
          string = string.slice(0, -2);
        } else if (prev2Chars == "$*") {
          // makes the value injectable html 
          // WARNING: this is not safe...
          value = nonEscapingHTML(value);
          string = string.slice(0, -2);
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
      if (!(attributeValues.length === 0 && nodeValues.length === 0 && !options.scripts)) {
        for (var _i = 0; _i < nodes.length; ++_i) {
          traverseDOM(arrNodes[_i], nodeValues.slice(), attributeValues.slice(), options);
        }
      }
      var fragment = appendFrag(nodes);
      return fragment;
    }

    function traverseDOM(node, nodeValues, attributeValues, options) {
      var replaced = false;
      var replacement;

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.className === CONTOURS_UNIQUE_CLASS) {
          if (nodeValues.length > 0) {
            replacement = nodeValues.shift();
            if (replacement instanceof jQueryTemp) {
              jQueryTemp(node).replaceWith(replacement);
            } else {
              node.parentNode.replaceChild(replacement, node);
            }
            replaced = true;
          }
        } else {
          if (node.hasAttribute(CONTOURS_ATTRIBUTES_TEMP_ATTR)) {
            if (attributeValues.length > 0) {
              setAttributes(node, attributeValues.shift());
              node.removeAttribute(CONTOURS_ATTRIBUTES_TEMP_ATTR);
            }
          }
          if (options.scripts && (node.tagName || "").toUpperCase() === 'SCRIPT') {
            enableScript(node);
          }
        }

        if (!replaced) {
          var i = 0;
          var children = node.childNodes;
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (attributeValues.length === 0 && nodeValues.length === 0 && !options.scripts) {
              return;
            } else {
              traverseDOM(child, nodeValues, attributeValues, options);
            }
          }
        }
      }
    }

    function enableScript(node) {
      node.parentNode.replaceChild(nodeScriptClone(node), node);
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
        if (typeof el.querySelectorAll === "function") {
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
            key = key.replace(/^on/, "");
            key = key[0].toLowerCase() + key.slice(1);
            elNode.addEventListener(key, val);
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
      for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        values[_key2 - 1] = arguments[_key2];
      }

      return DOMTemplate(html, values);
    }

    function custom(options) {
      return function _contoursCustom(html) {
        for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          values[_key3 - 1] = arguments[_key3];
        }

        return DOMTemplate(html, values, options);
      };
    }

    function attributes(obj) {
      return Object.assign({}, obj, _defineProperty({}, CONTOURS_ATTRIBUTES_KEY, true));
    }

    function nonEscapingHTML() {
      var _ref2;

      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      return _ref2 = {}, _defineProperty(_ref2, CONTOURS_NONESCAPING_HTML_KEY, true), _defineProperty(_ref2, 'val', val), _ref2;
    }

    // we're giving the contours function some extra properties.
    return Object.assign(_contours, {
      safeHTML: safeHTML,
      custom: custom
    });
  }();

  exports.default = contours;
  var custom = contours.custom,
      safeHTML = contours.safeHTML;
  exports.safeHTML = safeHTML;
  exports.custom = custom;
});
//# sourceMappingURL=contours.js.map
