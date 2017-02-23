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
        // added to objects to show that the object is meant to be an attributes object
  const CONTOURS_ATTRIBUTES_KEY = "__contours_attributes__",
        // temp attribute added to signify this element has attributes to be added
        CONTOURS_ATTRIBUTES_TEMP_ATTR = "data-contours-attrs",
        // a unique class used for pinpointing contours value placeholder elements
        CONTOURS_UNIQUE_CLASS = "contours-shouldBeUnique",
        // added to objects to show that the object is meant to be an hold escaped html
        CONTOURS_NONESCAPING_HTML_KEY = "__contours_nonEscapingHTML__";
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
    return `<template class="${CONTOURS_UNIQUE_CLASS}"></template>`;
  }

  function getNode (nodeValues, attributeValues, value, strings, index, docFrag = false) {
    var i, html = "";
    if(value || value === 0) {
      if(value instanceof Node) {
        // value is a dom node 
        // replace it in the string with a temporary template node
        if(!docFrag) {
          html += getReplaceText(strings, index);
          nodeValues.push(value);
        } else {
          docFrag.appendChild(value);
        }
      } else if(value instanceof jQueryTemp) {
        // value is jQuery element
        // replace it in the string with a temporary template node
        if(!docFrag) {
          html += getReplaceText(strings, index);
          nodeValues.push(value);
        } else {
          value.appendTo(docFrag);
        }
      } else if (Array.isArray(value)) {
        // value is Array element
        // call getNode recursively for each element of the array.
        let frag = document.createDocumentFragment();
        for(i = 0; i < value.length; ++i) {
          html += getNode(nodeValues, attributeValues, value[i], strings, index,frag);
        }
        if(!docFrag) {
          html += getReplaceText(strings, index);
          nodeValues.push(frag);
        } else {
          docFrag.appendChild(frag)
        }
      } else if (Array.isArray(value)) {
        // value is Array element
        // call getNode recursively for each element of the array.
        let frag = document.createDocumentFragment();
        for(i = 0; i < value.length; ++i) {
          html += getNode(nodeValues, attributeValues, value[i], strings, index, frag);
        }
        if(!docFrag) {
          html += getReplaceText(strings, index);
          nodeValues.push(frag);
        } else {
          docFrag.appendChild(frag)
        }
      } else if (value instanceof NodeList || value instanceof HTMLCollection) {
        // value is some form of NodeList
        // call getNode recursively for each element
        let frag = document.createDocumentFragment();
        value = [].slice.call(value);
        if(!docFrag) {
          for(i = 0; i < value.length; ++i) {
            getNode(nodeValues, attributeValues, value[i], strings, index, frag);
          }
          html += getReplaceText(strings, index);
          nodeValues.push(frag);
        } else {
          docFrag.appendChild(frag)
        }
      } else if (value !== null && typeof value === "object") {
        // checking for special contours objects which have
        // special keys on them
        if(value[CONTOURS_ATTRIBUTES_KEY]) {
          // add an attribute placeholder to html element at current location in string
          // it's up to the user to guarantee that they
          // have a valid placement
          if(docFrag) {
            throw new Error("There shouldn't be a contours attribute in an array given to contours. Value given: " + JSON.stringify(value));
          }
          html += " " + CONTOURS_ATTRIBUTES_TEMP_ATTR + " ";
          delete value[CONTOURS_ATTRIBUTES_KEY];
          attributeValues.push(value);
        } else if (value[CONTOURS_NONESCAPING_HTML_KEY]) {
          // makes the value injectable html 
          // WARNING: this is not safe...
          if(docFrag) {
            throw new Error("There shouldn't be injectable HTML inside an array given to contours. Value given: " + JSON.stringify(value));
          }
          html += value.val;
        }
      } else {
        // escape value otherwise
        if(!docFrag) {
          html += contours.escapeHTML("" + value);
        } else {
          docFrag.appendChild(contours.textNode(value));
        }
      }
    }
    return html;
  }

  function DOMTemplate (strings, values, options = {}) {
    // this is contours main function
    // DOMTemplate goes through a string building process
    // then a linking process to link values that can't be
    // added with pure strings like DOM elements and the like
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

    // string building process
    let i;
    for(i = 0; i < values.length; ++i) {
      let string = strings[i];
      let value = values[i];
      let prev2Chars = string.slice(-2);
      if(prev2Chars == "$#") {
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
      }else if (string.slice(-1) == "$") {
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
    var replaced = false;
    var replacement;
    if(attributeValues.length === 0 && nodeValues.length === 0 && !options.includeScripts) {
      return;
    }

    if(node.nodeType === Node.ELEMENT_NODE) {
      if(node.className === CONTOURS_UNIQUE_CLASS) {
        if(nodeValues.length > 0) {
          replacement = nodeValues.shift();
          if(replacement instanceof jQueryTemp) {
            jQueryTemp(node).replaceWith(replacement);
          } else {
            node.parentNode.replaceChild(replacement, node);
          }
          replaced = true;
        }
      } else {
        if(node.hasAttribute(CONTOURS_ATTRIBUTES_TEMP_ATTR)) {
          if(attributeValues.length > 0) {
            setAttributes(node, attributeValues.shift());
            node.removeAttribute(CONTOURS_ATTRIBUTES_TEMP_ATTR);
          }
        }
        if (options.includeScripts && (node.tagName || "").toUpperCase() === 'SCRIPT') {
          node.parentNode.replaceChild( nodeScriptClone(node) , node );
        }
      }

      if(!replaced) {
        var i        = 0;
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
          let child = children[i];
          traverseDOM( child, nodeValues, attributeValues, options );
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
        var uniqueEls = [].slice.call(el.querySelectorAll(`[${CONTOURS_ATTRIBUTES_TEMP_TXT}]`));
        if(el.hasAttribute(CONTOURS_ATTRIBUTES_TEMP_TXT)) {
          uniqueEls.push(el);
        }
        for(var i = 0; i < uniqueEls.length; ++i, ++j) {
          setAttributes(uniqueEls[i], attributeValues[j]);
          uniqueEls[i].removeAttribute(CONTOURS_ATTRIBUTES_TEMP_TXT);
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
      // the [] brackets denote a computed property
      // the value of the variable will be the property
      [CONTOURS_ATTRIBUTES_KEY]: true
    });
  }

  function nonEscapingHTML(val = "") {
    return {
      [CONTOURS_NONESCAPING_HTML_KEY]: true,
      val: val 
    }
  }

  // we're giving the contours function some extra properties.
  return Object.assign(_contours, {
    escapeHTML: escapeHTML,
    nonEscapingHTML: nonEscapingHTML,
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
