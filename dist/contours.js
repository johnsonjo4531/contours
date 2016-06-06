'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
  var jQueryTemp = typeof jQuery !== "undefined" ? jQuery : function noJQuery() {};

  var __entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function simpleEscape(str) {
    return str.replace(/[&<>"'\/]/g, function (s) {
      return __entityMap[s];
    });
  }

  var wrapMap = {
    // Support: IE 9
    option: [1, "<select multiple='multiple'>", "</select>"],

    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

    _default: [0, "", ""]
  };

  function parseHTML(markup, firstChildOnly) {
    if (firstChildOnly) {
      markup = markup.trim();
    }
    var el = document.createElement("div");
    var mathSpecialCases = /^[^<]*<((?:option)|(?:thead)|(?:col)|(?:tr)|(?:td))[^>]*>/i;
    var firstNodeSpecial = mathSpecialCases.exec(markup);
    var wrap = wrapMap[(firstNodeSpecial || [])[1]] || wrapMap["_default"];
    el.innerHTML = wrap[1] + markup + wrap[2];
    for (var i = 0; i < wrap[0]; ++i) {
      el = el.firstChild;
    }
    if (firstChildOnly) {
      return el.firstChild;
    } else {
      return el.childNodes;
    }
  }

  var validInnerElMap = {
    // Support: IE 9
    select: '<option class="DOMTemplate-shouldBeUnique"></option>',

    table: '<tbody class="DOMTemplate-shouldBeUnique"></tbody>',
    colgroup: '<col class="DOMTemplate-shouldBeUnique"></col>',
    tbody: '<tr class="DOMTemplate-shouldBeUnique"></tr>',
    tr: '<td class="DOMTemplate-shouldBeUnique"></td>',

    _default: '<div class="DOMTemplate-shouldBeUnique"></div>'
  };

  function getReplaceText(strings, index) {
    var selfClosingTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
        html = strings.slice(0, index + 1).join(""),
        openTag = /<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?![\s\S]*<\/\1>)/gi,
        tagNameRegex = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>$/i,
        nonSelfClosing = [],
        tagname;

    var results = html.match(openTag) || [];

    for (var i = 0; i < results.length; ++i) {
      tagname = (tagNameRegex.exec(results[i]) || [])[1];
      if (selfClosingTags.indexOf(tagname) === -1) {
        nonSelfClosing.push(tagname);
      }
    }
    if (nonSelfClosing.length > 0) {
      return validInnerElMap[nonSelfClosing.slice(-1)] || validInnerElMap["_default"];
    }
    return validInnerElMap["_default"];
  }

  function getNode(html, userValues, value, strings, index) {
    var i;
    if (value || value === 0) {
      if (value instanceof Node) {
        html += getReplaceText(strings, index);
        userValues.nodeValues.push(value);
      } else if (value instanceof jQueryTemp) {
        html += getReplaceText(strings, index);
        userValues.nodeValues.push(value);
      } else if (Array.isArray(value)) {
        for (i = 0; i < value.length; ++i) {
          html += getNode("", userValues, value[i], strings, index);
        }
      } else if (value instanceof NodeList) {
        value = [].slice.call(value);
        for (i = 0; i < value.length; ++i) {
          html += getNode("", userValues, value[i], strings, index);
        }
      } else if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object" && value["__contours_attributes__"]) {
        html += " data-contours-attrs ";
        delete value["__contours_attributes__"];
        userValues.attributeValues.push(value);
      } else {
        html += value;
      }
    }
    return html;
  }

  function DOMTemplate(strings, values) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var defaults = {
      multipleRoots: false,
      includeScripts: false
    };

    options = Object.assign({}, defaults, options);
    var firstChildOnly = !options.multipleRoots;

    var html = strings[0],
        nodeValues = [],
        attributeValues = [],
        node,
        nodes,
        replaceNodes,
        i,
        j,
        replace,
        replacement,
        userValues = {
      nodeValues: nodeValues,
      attributeValues: attributeValues
    };

    for (i = 1; i < strings.length; ++i) {
      var value = values[i - 1];
      html += getNode("", userValues, value, strings, i - 1);

      html += strings[i];
    }

    if (firstChildOnly) {
      node = parseHTML(html, true);
      traverseDOM(node, Object.assign({}, userValues), options);
      return node;
    } else {
      nodes = parseHTML(html, false);
      var arrNodes = [].slice.call(nodes);
      for (var i = 0; i < nodes.length; ++i) {
        traverseDOM(arrNodes[i], Object.assign({}, userValues), options);
      }
      var fragment = document.createDocumentFragment();
      var length = nodes.length;
      for (i = 0; i < length; ++i) {
        fragment.appendChild(nodes[0]);
      }
      return fragment;
    }
  }

  function traverseDOM(node, userValues, options) {
    var notReplaced = true;
    var replacement;
    if (userValues.attributeValues.length === 0 && userValues.nodeValues.length === 0 && !options.includeScripts) {
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.className === "DOMTemplate-shouldBeUnique") {
        if (userValues.nodeValues.length > 0) {
          replacement = userValues.nodeValues.shift();
          if (replacement instanceof jQueryTemp) {
            jQueryTemp(node).replaceWith(replacement);
          } else {
            node.parentNode.replaceChild(replacement, node);
          }
        }
      } else {
        if (node.hasAttribute("data-contours-attrs")) {
          if (userValues.attributeValues.length > 0) {
            setAttributes(node, userValues.attributeValues.shift());
            node.removeAttribute("data-contours-attrs");
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
          traverseDOM(children[i++], userValues, options);
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
        var uniqueEls = [].slice.call(el.querySelectorAll("[data-contours-attrs]"));
        if (el.hasAttribute("data-contours-attrs")) {
          uniqueEls.push(el);
        }
        for (var i = 0; i < uniqueEls.length; ++i, ++j) {
          setAttributes(uniqueEls[i], attributeValues[j]);
          uniqueEls[i].removeAttribute("data-contours-attrs");
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
    var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
      var _allAttributes$i = _slicedToArray(allAttributes[i], 2);

      var key = _allAttributes$i[0];
      var val = _allAttributes$i[1];

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
    return Object.assign({}, obj, {
      "__contours_attributes__": true
    });
  }

  return Object.assign(_contours, {
    simpleEscape: simpleEscape,
    textNode: function textNode(text) {
      return document.createTextNode(text);
    },
    multipleRoots: function _contoursMulti(html) {
      for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      return DOMTemplate(html, values, { multipleRoots: true });
    },
    custom: custom,
    attributes: attributes
  });
}();