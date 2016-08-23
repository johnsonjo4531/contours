// from mdn
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// from mdn
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
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

if(!Object.entries) {
  Object.entries = function (obj) {
    return Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });
  }
}

var contours = (function contour () {
  var jQueryTemp = typeof jQuery !== "undefined" ? jQuery : function noJQuery () {};

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

  function escapeHTML(str){
		// this is a basic parser
		var b = "";
		for (var i=0; i<str.length; i++){
			var c = str.charAt(i);
			if (c == "&") b += "&amp;";
			else if (c == "<") b += "&lt;";
			else if (c == ">") b += "&gt;";
			else if (c == '"') b += "&quot;";
			else if (c == "'") b += "&#39;";
			else if (c == "/") b += "&#x2F;";
			else b += c;
		}
		return b;
	}

  function parseHTML (markup) {
    markup = markup.trim();
    let el = document.createElement("template");
  	el.innerHTML = markup;
    return el.content.childNodes;
  }

  function getReplaceText(strings, index) {
    return '<template class="contours-shouldBeUnique"></template>';
  }

  function getNode (nodeValues, attributeValues, value, strings, index) {
    var i, html = "";
    if(value || value === 0) {
      if(value instanceof Node) {
        html += getReplaceText(strings, index);
        nodeValues.push(value);
      } else if(value instanceof jQueryTemp) {
        html += getReplaceText(strings, index);
        nodeValues.push(value);
      } else if (Array.isArray(value)) {
        for(i = 0; i < value.length; ++i) {
          html += getNode(nodeValues, attributeValues, value[i], strings, index);
        }
      } else if (value instanceof NodeList || value instanceof HTMLCollection) {
        value = [].slice.call(value);
        for(i = 0; i < value.length; ++i) {
          html += getNode(nodeValues, attributeValues, value[i], strings, index);
        }
      } else if (value !== null && typeof value === "object" && value["__contours_attributes__"]) {
        html += " data-contours-attrs ";
        delete value["__contours_attributes__"];
        attributeValues.push(value);
      } else {
        html += value;
      }
    }
    return html;
  }

  function DOMTemplate (strings, values, options = {}) {
    var defaults = {
      includeScripts: false
    };

    options = Object.assign({}, defaults, options);

    let html = '',
        nodeValues = [],
        attributeValues = [],
        node,
        nodes,
        replaceNodes,
        replace,
        replacement;

    let i;
    for(i = 0; i < values.length; ++i) {
      let string = strings[i];
      let value = values[i];
      let prev2Chars = string.slice(-2);
      if(prev2Chars == "$#") {
        value = contours.textNode(value);
        string = string.slice(0, -2);
      } else if (prev2Chars == "$@") {
        value = contours.attributes(value);
        string = string.slice(0, -2);
      } else if (string.slice(-1) == "$") {
        value = contours.escapeHTML(value);
        string = string.slice(0, -1);
      }

      html += string;

      html += getNode(nodeValues, attributeValues, value, strings, i);
    }
    html += strings[i];

    nodes = parseHTML(html);
    let arrNodes = [].slice.call(nodes);
    for(let i = 0; i < nodes.length; ++i) {
      traverseDOM(arrNodes[i], nodeValues.slice(), attributeValues.slice(), options);
    }
    let fragment = document.createDocumentFragment();
    let length = nodes.length;
    for(let i = 0; i < length; ++i) {
      fragment.appendChild(nodes[0]);
    }
    return fragment;

  }

  function traverseDOM (node, nodeValues, attributeValues, options) {
    var notReplaced = true;
    var replacement;
    if(attributeValues.length === 0 && nodeValues.length === 0 && !options.includeScripts) {
      return;
    }

    if(node.nodeType === Node.ELEMENT_NODE) {
      if(node.className === "contours-shouldBeUnique") {
        if(nodeValues.length > 0) {
          replacement = nodeValues.shift();
          if(replacement instanceof jQueryTemp) {
            jQueryTemp(node).replaceWith(replacement);
          } else {
            node.parentNode.replaceChild(replacement, node);
          }
        }
      } else {
        if(node.hasAttribute("data-contours-attrs")) {
          if(attributeValues.length > 0) {
            setAttributes(node, attributeValues.shift());
            node.removeAttribute("data-contours-attrs");
          }
        }
        if (options.includeScripts && (node.tagName || "").toUpperCase() === 'SCRIPT') {
          node.parentNode.replaceChild( nodeScriptClone(node) , node );
        }
      }

      if(notReplaced) {
        var i        = 0;
        var children = node.childNodes;
        while ( i < children.length ) {
          traverseDOM( children[i++], nodeValues, attributeValues, options );
        }
      }
    }
  }

  function nodeScriptClone(node){
    var script  = document.createElement("script");
    script.text = node.innerHTML;
    for( var i = node.attributes.length-1; i >= 0; i-- ) {
      script.setAttribute( node.attributes[i].name, node.attributes[i].value );
    }
    return script;
  }

  function setAttributesAll (nodes, attributeValues) {
    var j = 0;
    nodes.forEach(function (el) {
      if(typeof el.getElementsByClassName === "function") {j
        var uniqueEls = [].slice.call(el.querySelectorAll("[data-contours-attrs]"));
        if(el.hasAttribute("data-contours-attrs")) {
          uniqueEls.push(el);
        }
        for(var i = 0; i < uniqueEls.length; ++i, ++j) {
          setAttributes(uniqueEls[i], attributeValues[j]);
          uniqueEls[i].removeAttribute("data-contours-attrs");
        }
      }
    });
  }

  function partition (list,cb) {
    if(typeof cb === "function") {
        let results = [];
        results.push([]);
        results.push([]);

        let testPassing = function (condition, val) {
          if(condition) {
            results[0].push(val);
          } else {
            results[1].push(val);
          }
        }


      if(typeof list === "object" && !Array.isArray(list)) {
        Object.keys(list).forEach(function (key) {
          var obj = {};
          obj[key] = list[key];
          testPassing(cb(list[key], key, list), obj);
        });
      } else {
        for(var i = 0; i < list.length; ++i) {
          testPassing(cb(list[i], i, list), list[i]);
        }
      }
      return results;
    }
  }

  var fromCamelToKabobCase = str => str.replace(/([A-Z])/g, "-$1").toLowerCase();

  function setAttributes (elNode, attributes = {}) {
    var style, styleString;
    if(attributes.style && typeof attributes.style === "object") {
      style = attributes.style;
      delete attributes.style;
      styleString = Object.keys(style).map(function (key) {
        return `${fromCamelToKabobCase(key)}: ${style[key]};`;
      }).join(" ");
      elNode.setAttribute("style", styleString);
    }
    var allAttributes = Object.entries(attributes);
    for(var i = 0; i < allAttributes.length; ++i) {
      var [key, val] = allAttributes[i];
      if(/^on/.test(key)) {
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

  function _contours (html, ...values) {
    return DOMTemplate(html, values);
  }

  function custom (options) {
    return function _contoursCustom (html, ...values) {
      return DOMTemplate(html, values, options);
    };
  }

  function attributes (obj) {
    return Object.assign({}, obj, {
      "__contours_attributes__": true
    });
  }

  return Object.assign(_contours, {
    escapeHTML: escapeHTML,
    textNode: function (text) {
      return document.createTextNode(text);
    },
    custom: custom,
    attributes: attributes
  });
}());

export default contours;

var {escapeHTML, textNode, custom, attributes} = contours;

export {
  escapeHTML,
  textNode,
  custom,
  attributes
}
