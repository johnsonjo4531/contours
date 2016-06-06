"use strict";

var _templateObject = _taggedTemplateLiteral(["\n    <div>\n      <h1>Greetings</h1>", "\n    </div>\n  "], ["\n    <div>\n      <h1>Greetings</h1>", "\n    </div>\n  "]),
    _templateObject2 = _taggedTemplateLiteral(["<h1>Greetings</h1>", ""], ["<h1>Greetings</h1>", ""]),
    _templateObject3 = _taggedTemplateLiteral(["\n    <div>\n      ", "\n    </div>\n  "], ["\n    <div>\n      ", "\n    </div>\n  "]),
    _templateObject4 = _taggedTemplateLiteral(["\n    <div>\n      ", "", "\n    </div>\n  "], ["\n    <div>\n      ", "", "\n    </div>\n  "]),
    _templateObject5 = _taggedTemplateLiteral(["\n    <div>\n      ...\n      <div class=\"js-insertUserText\">", "</div>\n      ...\n    </div>\n  "], ["\n    <div>\n      ...\n      <div class=\"js-insertUserText\">", "</div>\n      ...\n    </div>\n  "]),
    _templateObject6 = _taggedTemplateLiteral(["\n    <div>\n      ...\n      ", "\n      ...\n    </div>\n  "], ["\n    <div>\n      ...\n      ", "\n      ...\n    </div>\n  "]),
    _templateObject7 = _taggedTemplateLiteral(["\n      <ul>\n        ", "\n      </ul>\n    "], ["\n      <ul>\n        ", "\n      </ul>\n    "]),
    _templateObject8 = _taggedTemplateLiteral(["<li class=\"li-", "\">", "</li>"], ["<li class=\"li-", "\">", "</li>"]),
    _templateObject9 = _taggedTemplateLiteral(["\n      <table>\n        <tbody>\n          ", "\n        </tbody>\n      </table>\n    "], ["\n      <table>\n        <tbody>\n          ", "\n        </tbody>\n      </table>\n    "]),
    _templateObject10 = _taggedTemplateLiteral(["<tr>", "</tr>"], ["<tr>", "</tr>"]),
    _templateObject11 = _taggedTemplateLiteral(["<td>", "</td>"], ["<td>", "</td>"]),
    _templateObject12 = _taggedTemplateLiteral(["<div data-name=\"", "\"></div>"], ["<div data-name=\"", "\"></div>"]),
    _templateObject13 = _taggedTemplateLiteral(["<h1 ", ">world</h1>"], ["<h1 ", ">world</h1>"]),
    _templateObject14 = _taggedTemplateLiteral(["<h1 ", "></h1>"], ["<h1 ", "></h1>"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

QUnit.test("contours main function works as expected", function (assert) {
  // Properly adds jQuery elements.
  var sameResult;

  var $message = $("<div>Hello World</div>");

  var result = contours(_templateObject, $message);

  //$result is a jQuery object with HTML content equivalent to:

  var resultHTML = "<div>\n      <h1>Greetings</h1><div>Hello World</div>\n    </div>";

  // since templates

  var $greetingEl = contours.multipleRoots(_templateObject2, $message.clone());

  var equivalentResult = contours(_templateObject3, $greetingEl);
  assert.equal(result.outerHTML, resultHTML, "Properly adds jQuery elements.");
  assert.equal(equivalentResult.outerHTML, resultHTML, "Properly adds multiple root nodes.");

  equivalentResult = contours(_templateObject4, $("<h1>Greetings</h1>"), $("<div>Hello World</div>"));

  assert.equal(equivalentResult.outerHTML, resultHTML, "Properly adds multiple placeholders and jQuery elements.");

  // Properly adds text nodes.

  var userText = "something dangerous!!!";

  // create new element
  resultHTML = "<div>\n      ...\n      <div class=\"js-insertUserText\">" + userText + "</div>\n      ...\n    </div>";

  sameResult = contours(_templateObject5, contours.textNode(userText));

  assert.equal(sameResult.outerHTML, resultHTML, "Properly adds text nodes.");

  // Basic DOM node works properly.

  var userText = "something dangerous!!!";

  // create new element
  resultHTML = "<div>\n      ...\n      <div></div>\n      ...\n    </div>";

  sameResult = contours(_templateObject6, document.createElement("div"));

  assert.equal(sameResult.outerHTML, resultHTML, "Basic DOM node works properly.");

  var userTexts = ["hello", "world", "something interesting"];

  var resultHTML = "<ul>\n        " + userTexts.map(function (el, i) {
    return "<li class=\"li-" + i + "\">" + el + "</li>";
  }).join("") + "\n      </ul>";

  /*userTexts.forEach(function (el, i) {
    $result.find(`.li-${i}`).append(document.createTextNode(el));
  })*/

  var sameResult = contours(_templateObject7, userTexts.map(function (el, i) {
    return contours(_templateObject8, i, document.createTextNode(el));
  }));
  assert.equal(sameResult.outerHTML, resultHTML, "Array of DOM nodes works properly.");

  var data = [["foo", "bar", "baz"], ['100', '220', '300'], ['300', '80', '400']];

  var table = contours(_templateObject9, data.map(function (data) {
    return contours(_templateObject10, data.map(function (datum) {
      return contours(_templateObject11, contours.textNode(datum));
    }));
  }));

  var sameTable = "<table>\n        <tbody>\n          " + data.map(function (data) {
    return "<tr>" + data.map(function (datum) {
      return "<td>" + datum + "</td>";
    }).join("") + "</tr>";
  }).join("") + "\n        </tbody>\n      </table>";

  assert.equal(table.outerHTML, sameTable, "Construct table elements.");
});

QUnit.test("simpleEscape works as expected", function (assert) {
  var _contours = contours;
  var simpleEscape = _contours.simpleEscape;

  var userText = '"><script>window.callback(); // malicous code could be here</script><div class="';
  window.callback = sinon.spy();

  document.body.appendChild(contours.custom({
    includeScripts: true
  })(_templateObject12, userText));

  assert.ok(window.callback.called, "user script is called when includeScripts is true and escape is not called");

  window.callback = sinon.spy();

  document.body.appendChild(contours.custom({
    includeScripts: true
  })(_templateObject12, simpleEscape(userText)));

  assert.ok(!window.callback.called, "escaped user script isn't ran");
});

QUnit.test("contours attributes functions works as expected", function (assert) {

  assert.equal('<h1 class="true">world</h1>', contours(_templateObject13, contours.attributes({ class: "true" })).outerHTML, "basic h1 with text and attributes.");
  assert.equal('<h1 data-action="true"></h1>', contours(_templateObject14, contours.attributes({ "data-action": "true" })).outerHTML, "basic h1 with data-attributes no text w/ skipping of second param.");
  assert.equal('<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours(_templateObject14, contours.attributes({ style: "padding: 10px; margin: 10px; line-height: 1em;" })).outerHTML, "basic h1 with style attribute string.");
  assert.equal('<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours(_templateObject14, contours.attributes({ style: { padding: "10px", margin: "10px", lineHeight: "1em" } })).outerHTML, "basic h1 with style attributes object.");
  assert.equal('<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours(_templateObject14, contours.attributes({ style: { padding: "10px", margin: "10px", "line-height": "1em" } })).outerHTML, "basic h1 with style attributes object no camel case.");
});