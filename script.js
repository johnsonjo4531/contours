function loader() {
  var words = ["How", "are", "you,", "buddy"]

  document.body.appendChild(contours`
    <div>
        Hello<!--
        -->${contours`<span class="blue">, waz up,</span>`}
      <b class="red">${contours.textNode("world!")}</b>
      ${words.map(function (el, i, list) { return contours`<span> ${contours.textNode(el)}</span>`; })}?
      ${$('<div class="blue">I\'m blue adabah dee bah duh dah</div>')}
    </div>
  `);

  var html = `
    <div>
      Hello
      <b>world</b>
    </div>
  `;

  document.body.appendChild(contours`<div>${contours.multipleRoots`<span>Hello, is it me </span> <span> your looking for?</span>`}</div>`);

  var docBody = document.body;
  var $docBody = $(document.body);
  var iterations = 0;

  console.time("contours");
  for(var i = 0; i < iterations; ++i) {
    docBody.appendChild(contours`
      <div>
        Hello
        <b>${"world"}</b>
      </div>
    `);
  }
  console.timeEnd("contours");

  console.time("jQuery");
  for(var i = 0; i < iterations; ++i) {
    $docBody.append(html);
  }
  console.timeEnd("jQuery");
  console.groupEnd("straight html");

  console.group("textNodes");

  console.time("contours");

  for(var i = 0; i < iterations; ++i) {
    docBody.appendChild(contours`
      <div>
        Hello
        <b>${contours.textNode("<script>world</script>")}</b>
      </div>
    `);
  }
  console.timeEnd("contours");

  console.time("jQuery");
  for(var i = 0; i < iterations; ++i) {
    var $el = $(`<div>
        Hello
        <b class="text-area"></b>
      </div>`);
    $el.find(".text-area").text("<script>world</script>")
    $docBody.append($el);
  }
  console.timeEnd("jQuery");
  console.groupEnd("textNodes");

  iterations = 0;

  console.group("multiple siblings");
  console.time("contours");
  for(var i = 0; i < iterations; ++i) {
    $docBody.append(contours.multipleRoots`<span>Hello, is it me </span> <span> (or is it not me either way is fine) </span> <span> your looking for?</span>`);
  }
  console.timeEnd("contours");

  console.time("jQuery");
  for(var i = 0; i < iterations; ++i) {
    $docBody.append(`<span>Hello, is it me </span> <span> (or is it not me either way is fine) </span> <span> your looking for?</span>`);
  }
  console.timeEnd("jQuery");
  console.groupEnd("multiple siblings");

  console.group("multiple siblings text node insertion");
  console.time("contours");
  for(var i = 0; i < iterations; ++i) {
    $docBody.append(contours.multipleRoots`<span>Hello, is it me </span> <span> (or is it not me either way is fine) </span> <span> your ${contours.textNode("looking for")}?</span>`);
  }
  console.timeEnd("contours");

  console.time("jQuery");
  for(var i = 0; i < iterations; ++i) {
    var $el = $(`<span>Hello, is it me </span> <span> (or is it not me either way is fine) </span> <span> your <span id="somethingUnique"></span>?</span>`);
    $el.find("#somethingUnique").replaceWith(document.createTextNode("looking for"));
    $docBody.append($el);
  }
  console.timeEnd("jQuery");
  console.groupEnd("multiple siblings text node insertion");
}
