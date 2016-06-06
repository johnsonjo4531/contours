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

  var $greetingEl = contours.multipleRoots`<h1>Greetings</h1>${$message.clone()}`;

  var equivalentResult = contours`
    <div>
      ${$greetingEl}
    </div>
  `;
  assert.equal(result.outerHTML, resultHTML, "Properly adds jQuery elements." );
  assert.equal(equivalentResult.outerHTML, resultHTML, "Properly adds multiple root nodes.");

  equivalentResult = contours`
    <div>
      ${$("<h1>Greetings</h1>")}${$("<div>Hello World</div>")}
    </div>
  `;

  assert.equal(equivalentResult.outerHTML, resultHTML, "Properly adds multiple placeholders and jQuery elements." );

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
      <div class="js-insertUserText">${contours.textNode(userText)}</div>
      ...
    </div>
  `;

  assert.equal( sameResult.outerHTML, resultHTML, "Properly adds text nodes." );

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

  assert.equal( sameResult.outerHTML, resultHTML, "Basic DOM node works properly." );


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
    assert.equal( sameResult.outerHTML, resultHTML, "Array of DOM nodes works properly." );

    var data = [
      ["foo", "bar", "baz"],
      ['100', '220', '300'],
      ['300', '80', '400']
    ];

    var table = contours`
      <table>
        <tbody>
          ${data.map(data => {
            return contours`<tr>${data.map((datum) => contours`<td>${contours.textNode(datum)}</td>`)}</tr>`;
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

    assert.equal(table.outerHTML, sameTable, "Construct table elements.");
});

QUnit.test( "simpleEscape works as expected", function( assert ) {
  var {escapeHTML} = contours;
  var userText = '"><script>window.callback(); // malicous code could be here</script><div class="';
  window.callback = sinon.spy();

  document.body.appendChild(
    contours.custom({
      includeScripts: true
    })`<div data-name="${userText}"></div>`
  );


  assert.ok(window.callback.called, "user script is called when includeScripts is true and escape is not called");


  window.callback = sinon.spy();

  document.body.appendChild(
    contours.custom({
      includeScripts: true
    })`<div data-name="${escapeHTML(userText)}"></div>`
  );

  assert.ok(!window.callback.called, "escaped user script isn't ran");
});

QUnit.test( "contours attributes functions works as expected", function( assert ) {

  assert.equal( '<h1 class="true">world</h1>', contours`<h1 ${contours.attributes({class: "true" })}>world</h1>`.outerHTML, "basic h1 with text and attributes." );
  assert.equal( '<h1 data-action="true"></h1>', contours`<h1 ${contours.attributes({"data-action": "true" })}></h1>`.outerHTML, "basic h1 with data-attributes no text w/ skipping of second param." );
  assert.equal( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours`<h1 ${contours.attributes({style: "padding: 10px; margin: 10px; line-height: 1em;" })}></h1>`.outerHTML, "basic h1 with style attribute string." );
  assert.equal( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours`<h1 ${contours.attributes({style: {padding: "10px", margin: "10px", lineHeight: "1em"} })}></h1>`.outerHTML, "basic h1 with style attributes object." );
  assert.equal( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>', contours`<h1 ${contours.attributes( {style: {padding: "10px", margin: "10px", "line-height": "1em"} })}></h1>`.outerHTML, "basic h1 with style attributes object no camel case." );

});
