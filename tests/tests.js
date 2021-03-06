(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../dist/contours"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../dist/contours"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.contours);
    global.testsEs6 = mod.exports;
  }
})(this, function (_contours) {
  "use strict";

  var _contours2 = _interopRequireDefault(_contours);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _templateObject = _taggedTemplateLiteral(["\n    <div>\n      <h1>Greetings</h1>", "\n    </div>\n  "], ["\n    <div>\n      <h1>Greetings</h1>", "\n    </div>\n  "]),
      _templateObject2 = _taggedTemplateLiteral(["<h1>Greetings</h1>", ""], ["<h1>Greetings</h1>", ""]),
      _templateObject3 = _taggedTemplateLiteral(["\n    <div>\n      ", "\n    </div>\n  "], ["\n    <div>\n      ", "\n    </div>\n  "]),
      _templateObject4 = _taggedTemplateLiteral(["\n    <div>\n      ", "", "\n    </div>\n  "], ["\n    <div>\n      ", "", "\n    </div>\n  "]),
      _templateObject5 = _taggedTemplateLiteral(["\n    <div>\n      ...\n      <div class=\"js-insertUserText\">$#", "</div>\n      ...\n    </div>\n  "], ["\n    <div>\n      ...\n      <div class=\"js-insertUserText\">$#", "</div>\n      ...\n    </div>\n  "]),
      _templateObject6 = _taggedTemplateLiteral(["\n    <div>\n      ...\n      ", "\n      ...\n    </div>\n  "], ["\n    <div>\n      ...\n      ", "\n      ...\n    </div>\n  "]),
      _templateObject7 = _taggedTemplateLiteral(["\n      <ul>\n        ", "\n      </ul>\n    "], ["\n      <ul>\n        ", "\n      </ul>\n    "]),
      _templateObject8 = _taggedTemplateLiteral(["<li class=\"li-", "\">", "</li>"], ["<li class=\"li-", "\">", "</li>"]),
      _templateObject9 = _taggedTemplateLiteral(["<li class=\"li-", "\">$#", "</li>"], ["<li class=\"li-", "\">$#", "</li>"]),
      _templateObject10 = _taggedTemplateLiteral(["\n      <table>\n        <tbody>\n          ", "\n        </tbody>\n      </table>\n    "], ["\n      <table>\n        <tbody>\n          ", "\n        </tbody>\n      </table>\n    "]),
      _templateObject11 = _taggedTemplateLiteral(["<tr>", "</tr>"], ["<tr>", "</tr>"]),
      _templateObject12 = _taggedTemplateLiteral(["<td>$#", "</td>"], ["<td>$#", "</td>"]),
      _templateObject13 = _taggedTemplateLiteral(["<div>Actually the DOM is fast.</div>"], ["<div>Actually the DOM is fast.</div>"]),
      _templateObject14 = _taggedTemplateLiteral(["<div>", "</div>"], ["<div>", "</div>"]),
      _templateObject15 = _taggedTemplateLiteral(["<div>$*", "</div>"], ["<div>$*", "</div>"]),
      _templateObject16 = _taggedTemplateLiteral(["<div data-name=\"$*", "\"></div>"], ["<div data-name=\"$*", "\"></div>"]),
      _templateObject17 = _taggedTemplateLiteral(["<div data-name=\"", "\"></div>"], ["<div data-name=\"", "\"></div>"]),
      _templateObject18 = _taggedTemplateLiteral(["<h1 $@", ">world</h1>"], ["<h1 $@", ">world</h1>"]),
      _templateObject19 = _taggedTemplateLiteral(["<h1 $@", "></h1>"], ["<h1 $@", "></h1>"]);

  function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  // import $ from "../node_modules/jquery/dist/jquery.js";
  // import QUnit from "../node_modules/qunitjs/qunit/qunit.js";
  // import sinon from "../node_modules/sinon/pkg/sinon.js";

  console.log("HERE IN MODULE");
  QUnit.test("contours main function works as expected", function (assert) {
    // Properly adds jQuery elements.
    var sameResult;

    var $message = $("<div>Hello World</div>");

    var result = (0, _contours2.default)(_templateObject, $message);

    //$result is a jQuery object with HTML content equivalent to:

    var resultHTML = "<div>\n      <h1>Greetings</h1><div>Hello World</div>\n    </div>";

    // since templates

    var $greetingEl = (0, _contours2.default)(_templateObject2, $message.clone());

    var equivalentResult = (0, _contours2.default)(_templateObject3, $greetingEl);
    assert.equal(result.firstChild.outerHTML, resultHTML, "Properly adds jQuery elements.");
    assert.equal(equivalentResult.firstChild.outerHTML, resultHTML, "Properly adds multiple root nodes.");

    equivalentResult = (0, _contours2.default)(_templateObject4, $("<h1>Greetings</h1>"), $("<div>Hello World</div>"));

    assert.equal(equivalentResult.firstChild.outerHTML, resultHTML, "Properly adds multiple placeholders and jQuery elements.");

    // Properly adds text nodes.

    var userText = "something dangerous!!!";

    // create new element
    resultHTML = "<div>\n      ...\n      <div class=\"js-insertUserText\">" + userText + "</div>\n      ...\n    </div>";

    sameResult = (0, _contours2.default)(_templateObject5, userText);

    assert.equal(sameResult.firstChild.outerHTML, resultHTML, "Properly adds text nodes.");

    // Basic DOM node works properly.

    var userText = "something dangerous!!!";

    // create new element
    resultHTML = "<div>\n      ...\n      <div></div>\n      ...\n    </div>";

    sameResult = (0, _contours2.default)(_templateObject6, document.createElement("div"));

    assert.equal(sameResult.firstChild.outerHTML, resultHTML, "Basic DOM node works properly.");

    var userTexts = ["hello", "world", "something interesting"];

    var resultHTML = "<ul>\n        " + userTexts.map(function (el, i) {
      return "<li class=\"li-" + i + "\">" + el + "</li>";
    }).join("") + "\n      </ul>";

    /*userTexts.forEach(function (el, i) {
      $result.find(`.li-${i}`).append(document.createTextNode(el));
    })*/

    var sameResult = (0, _contours2.default)(_templateObject7, userTexts.map(function (el, i) {
      return (0, _contours2.default)(_templateObject8, i, document.createTextNode(el));
    }));
    assert.equal(sameResult.firstChild.outerHTML, resultHTML, "Array of DOM nodes works properly.");

    var sameAsResult = (0, _contours2.default)(_templateObject7, userTexts.map(function (el, i) {
      return (0, _contours2.default)(_templateObject9, i, el);
    }));

    var data = [["foo", "bar", "baz"], ['100', '220', '300'], ['300', '80', '400']];

    var table = (0, _contours2.default)(_templateObject10, data.map(function (data) {
      return (0, _contours2.default)(_templateObject11, data.map(function (datum) {
        return (0, _contours2.default)(_templateObject12, datum);
      }));
    }));

    var sameTable = "<table>\n        <tbody>\n          " + data.map(function (data) {
      return "<tr>" + data.map(function (datum) {
        return "<td>" + datum + "</td>";
      }).join("") + "</tr>";
    }).join("") + "\n        </tbody>\n      </table>";

    assert.equal(table.firstChild.outerHTML, sameTable, "Construct table elements.");
  });

  QUnit.test("contours safeHTML function works as expected", function (assert) {
    var numDivs = 1;
    var safeHTML = _contours2.default.safeHTML;

    var sfInnerHTML = Array.from(Array(numDivs).keys()).map(function () {
      return safeHTML(_templateObject13);
    });
    var sfHTML = safeHTML(_templateObject14, sfInnerHTML).toFrag();

    var innerHTML = Array.from(Array(numDivs).keys()).map(function () {
      return "<div>Actually the DOM is fast.</div>";
    }).join("");
    var div = document.createElement("div");

    div.innerHTML = innerHTML;

    assert.equal(sfHTML.firstChild.outerHTML, div.outerHTML, "Construct safeHTML elements.");

    var mixedHTML = (0, _contours2.default)(_templateObject14, sfInnerHTML);

    assert.equal(mixedHTML.firstChild.outerHTML, div.outerHTML, "Construct mixed safeHTML and contours elements.");

    var actual = _contours2.default.safeHTML(_templateObject15, '<div>foo</div>').data;
    var expected = "<div><div>foo</div></div>";

    assert.equal(actual, expected);
  });

  QUnit.test("escaping works as expected", function (assert) {
    var userText = '"><script>window.callback(); // malicous code could be here</script><div class="';
    var safeHTML = _contours2.default.safeHTML;

    window.callback = sinon.spy();

    document.body.appendChild(_contours2.default.custom({
      scripts: true
    })(_templateObject16, userText));

    assert.ok(window.callback.called, "user script is called when scripts is true and escape is not called");

    window.callback = sinon.spy();

    document.body.appendChild(_contours2.default.custom({
      scripts: true
    })(_templateObject17, userText));

    assert.ok(!window.callback.called, "escaped user script isn't ran");

    document.body.appendChild(safeHTML(_templateObject16, userText).toFrag({ scripts: true }));

    assert.ok(window.callback.called, "unescaped user script is ran");
  });

  QUnit.test("contours attributes functions works as expected", function (assert) {
    window.callback = sinon.spy();
    assert.equal('<h1 class="true">world</h1>', (0, _contours2.default)(_templateObject18, { class: "true" }).firstChild.outerHTML, "basic h1 with text and attributes.");
    assert.equal('<h1 data-action="true"></h1>', (0, _contours2.default)(_templateObject19, { "data-action": "true" }).firstChild.outerHTML, "basic h1 with data-attributes no text w/ skipping of second param.");
    assert.equal('<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', (0, _contours2.default)(_templateObject19, { style: "padding: 10px; margin: 10px; line-height: 1em;" }).firstChild.outerHTML, "basic h1 with style attribute string.");
    assert.equal('<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', (0, _contours2.default)(_templateObject19, { style: { padding: "10px", margin: "10px", lineHeight: "1em" } }).firstChild.outerHTML, "basic h1 with style attributes object.");
    assert.equal('<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', (0, _contours2.default)(_templateObject19, { style: { padding: "10px", margin: "10px", "line-height": "1em" } }).firstChild.outerHTML, "basic h1 with style attributes object no camel case.");
  });
});