import contours from '../dist/contours';
// import $ from "../node_modules/jquery/dist/jquery.js";
// import QUnit from "../node_modules/qunitjs/qunit/qunit.js";
// import sinon from "../node_modules/sinon/pkg/sinon.js";

console.log("HERE IN MODULE");
QUnit.test( "contours main function works as expected", function( assert ) {
  // Properly adds jQuery elements.
  var sameResult;

  var $message = $("<div>Hello World</div>");

  var result = contours`
    <div>
      <h1>Greetings</h1>${$message}
    </div>
  `;

//$result is a jQuery object with HTML content equivalent to:

  var resultHTML = `<div>
      <h1>Greetings</h1><div>Hello World</div>
    </div>`;

// since templates

  var $greetingEl = contours`<h1>Greetings</h1>${$message.clone()}`;

  var equivalentResult = contours`
    <div>
      ${$greetingEl}
    </div>
  `;
  assert.equal(result.firstChild.outerHTML, resultHTML, "Properly adds jQuery elements." );
  assert.equal(equivalentResult.firstChild.outerHTML, resultHTML, "Properly adds multiple root nodes.");

  equivalentResult = contours`
    <div>
      ${$("<h1>Greetings</h1>")}${$("<div>Hello World</div>")}
    </div>
  `;

  assert.equal(equivalentResult.firstChild.outerHTML, resultHTML, "Properly adds multiple placeholders and jQuery elements." );

  // Properly adds text nodes.

  var userText = "something dangerous!!!";

  // create new element
  resultHTML = `<div>
      ...
      <div class="js-insertUserText">${userText}</div>
      ...
    </div>`;

  sameResult = contours`
    <div>
      ...
      <div class="js-insertUserText">$#${userText}</div>
      ...
    </div>
  `;

  assert.equal( sameResult.firstChild.outerHTML, resultHTML, "Properly adds text nodes." );

  // Basic DOM node works properly.

  var userText = "something dangerous!!!";

  // create new element
  resultHTML = `<div>
      ...
      <div></div>
      ...
    </div>`;

  sameResult = contours`
    <div>
      ...
      ${document.createElement("div")}
      ...
    </div>
  `;

  assert.equal( sameResult.firstChild.outerHTML, resultHTML, "Basic DOM node works properly." );


    var userTexts = ["hello", "world", "something interesting"];

    var resultHTML = `<ul>
        ${userTexts.map(function (el, i) {
          return `<li class="li-${i}">${el}</li>`;
        }).join("")}
      </ul>`;

    /*userTexts.forEach(function (el, i) {
      $result.find(`.li-${i}`).append(document.createTextNode(el));
    })*/

    var sameResult = contours`
      <ul>
        ${userTexts.map(function (el, i) {
          return contours`<li class="li-${i}">${document.createTextNode(el)}</li>`;
        })}
      </ul>
    `;
    assert.equal( sameResult.firstChild.outerHTML, resultHTML, "Array of DOM nodes works properly." );

    var sameAsResult = contours`
      <ul>
        ${userTexts.map(function (el, i) {
          return contours`<li class="li-${i}">$#${el}</li>`;
        })}
      </ul>
    `;

    var data = [
      ["foo", "bar", "baz"],
      ['100', '220', '300'],
      ['300', '80', '400']
    ];

    var table = contours`
      <table>
        <tbody>
          ${data.map(data => {
            return contours`<tr>${data.map((datum) => contours`<td>$#${datum}</td>`)}</tr>`;
          })}
        </tbody>
      </table>
    `;

    var sameTable = `<table>
        <tbody>
          ${data.map(data => {
            return `<tr>${data.map((datum) => `<td>${datum}</td>`).join("")}</tr>`;
          }).join("")}
        </tbody>
      </table>`;

    assert.equal(table.firstChild.outerHTML, sameTable, "Construct table elements.");
});

QUnit.test( "contours safeHTML function works as expected", function( assert ) {
  let numDivs = 1;
  let { safeHTML } = contours;
  var sfInnerHTML = Array.from(Array(numDivs).keys())
                    .map(() => safeHTML`<div>Actually the DOM is fast.</div>`);
    var sfHTML = safeHTML`<div>${sfInnerHTML}</div>`.toFrag();

  var innerHTML = Array.from(Array(numDivs).keys())
                    .map(() =>`<div>Actually the DOM is fast.</div>`).join("");
    var div = document.createElement("div");

    div.innerHTML = innerHTML;

    assert.equal(sfHTML.firstChild.outerHTML, div.outerHTML, "Construct safeHTML elements.");

    var mixedHTML = contours`<div>${sfInnerHTML}</div>`;

    assert.equal(mixedHTML.firstChild.outerHTML, div.outerHTML, "Construct mixed safeHTML and contours elements.");

    var actual = contours.safeHTML`<div>$*${'<div>foo</div>'}</div>`.data;
    var expected = `<div><div>foo</div></div>`;

    assert.equal(actual, expected);

});

QUnit.test( "escaping works as expected", function( assert ) {
  var userText = '"><script>window.callback(); // malicous code could be here</script><div class="';
  let { safeHTML } = contours;
  window.callback = sinon.spy();

  document.body.appendChild(
    contours.custom({
      scripts: true
    })`<div data-name="$*${userText}"></div>`
  );


  assert.ok(window.callback.called, "user script is called when scripts is true and escape is not called");


  window.callback = sinon.spy();

  document.body.appendChild(
    contours.custom({
      scripts: true
    })`<div data-name="${userText}"></div>`
  );

  assert.ok(!window.callback.called, "escaped user script isn't ran");

  document.body.appendChild(
    safeHTML`<div data-name="$*${userText}"></div>`.toFrag({scripts: true})
  );

  assert.ok(window.callback.called, "unescaped user script is ran");
});

QUnit.test( "contours attributes functions works as expected", function( assert ) {
  window.callback = sinon.spy();
  assert.equal( '<h1 class="true">world</h1>', contours`<h1 $@${({class: "true" })}>world</h1>`.firstChild.outerHTML, "basic h1 with text and attributes." );
  assert.equal( '<h1 data-action="true"></h1>', contours`<h1 $@${{"data-action": "true" }}></h1>`.firstChild.outerHTML, "basic h1 with data-attributes no text w/ skipping of second param." );
  assert.equal( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours`<h1 $@${({style: "padding: 10px; margin: 10px; line-height: 1em;" })}></h1>`.firstChild.outerHTML, "basic h1 with style attribute string." );
  assert.equal( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours`<h1 $@${({style: {padding: "10px", margin: "10px", lineHeight: "1em"} })}></h1>`.firstChild.outerHTML, "basic h1 with style attributes object." );
  assert.equal( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours`<h1 $@${( {style: {padding: "10px", margin: "10px", "line-height": "1em"} })}></h1>`.firstChild.outerHTML, "basic h1 with style attributes object no camel case." );

});
