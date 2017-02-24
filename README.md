
**contours.js is in early alpha, and may change so be warned.**
**symantic versioning will be followed in the stable version 1.0.0**


# contours.js


Contents
---
- [Intro](#examples)
- [Details](#details)
- [API](#api)
  - [contours](#contours)
    - [Interpolation Rules](#interpolation-rules)
  - [contours.safeHTML](#contourssafehtml)
  - [contours.custom()](#contourscustom)
- [License](#license)


Examples
----



Contours.js is a view micro-library for constructing views using ES2015 template strings. Contours is dependency free, but plays well with jQuery.

Contours provides composability with existing dom nodes and speed.

### composability when you need it

```
// an existing jquery object returning function
function getEl () {
  return $("<div>here's jQuery</div>");
}

var docFrag = contours`
<div>
  ${getEl()}
</div>
`

document.body.appendChild(docFrag);
```

#### speed when you need it

Use the safeHTML method of contours when creating lots of nodes.

```
var data = [1, 2, 3];
var getSafeHTML = (datum => safeHTML`<div>${datum}</div>`);
var obj = contours.safeHTML`
<div>
  ${data.map(getSafeHTML)}
</div>
`;
document.body.appendChild(obj.toFrag());
```

Here's an example usage.

```
var userData = [
  {
    name: "Joe Jackson",
    picture: "http://placehold.it/40x40"
  },
  {
    name: "Jessica Jackson",
    picture: "http://placehold.it/40x40"
  },
  {
    name: "Jimmy Jones",
    picture: "http://placehold.it/40x40"
  },
];

var frag = contours`
  <div class="userlist">
    ${userData.map(function (user) {
      return contours`
        <div>
          <img $@${{src: user.picture }}">
          $#${user.name}
        </div>
      `;
      })}
  </div>
`

document.body.appendChild(frag);
```

The above produces HTML like this: (with different white-space)

```
<body>
  ...
  <div class="userlist">
    <div>
      <img src="http://placehold.it/40x40">
      Joe Jackson
    </div>
    <div>
      <img src="http://placehold.it/40x40">
      Jessica Jackson
    </div>
    <div>
      <img src="http://placehold.it/40x40">
      Jimmy Jones
    </div>
  </div>
</body>
```

The image can also be done like so:
```
contours`
  ...
  <img src="${user.picture}">
  ...
`
```

Details
----


Contours' main function is a template tag function that returns a DOM node. Which looks like this when called.

```
var el = contours`<div>Hello, world!</div>`;
document.body.appendChild(el);
 ```

 The above appends div element to body with content "Hello, world!"

Since contours is a template tag function it is able to intercept the values sent into it. Contours main feature is the ability to add DOM nodes, HTMLCollections, NodeLists, and jQuery wrapped elements that are sent in through the interpolation brackets (e.g. `${}`) to the spot they are located in the markup. Strings are escaped by default. With this feature you can easily append nodes in your markup.

API
----
###### In alphabetical order:

- [contours](#contours)
  - [Interpolation Rules](#interpolation-rules)
- [contours.safeHTML](#contourssafehtml)
- [contours.custom()](#contourscustom)

### contours
#### contours' template tag function

Usage: ``contours`some template string possibly with an ${interpolation values} or more` ``

function declaration: `contours(strings, ...values)`

return value: DOM Element

example:
```
var data = [
  ["foo", "bar", "baz"],
  ['100', '220', '300'],
  ['300', '80', '400']
];

document.body.appendChild(contours`
  <table>
    <tbody>
      ${data.map(data => {
        return contours`
          <tr>
            ${data.map((datum) => contours`<td>$#${datum}</td>`)}
          </tr>`;
      })}
    </tbody>
  </table>
`);

/*
builds a table that looks like this:
| foo  | bar  | baz  |
| 100  | 220  | 300  |
| 300  | 80   | 400  |
*/
```

The above example uses JavaScript's built in Array.prototype.map function.

description:
contours is a template tag function which constructs HTML from the strings and interpolation values provided. Calling this function like the above always uses its default. In order to use nonDefault options use `contours.custom()`.

contours uses `.innerHTML` internally but escapes strings by default instead of inserting them in as html.

Below are interpolation rules for the contours function

### Interpolation rules

The following are valid interpolation symbols and their functionality with contours:
- `${}`: if the value is a node like value insert it as a Node. Node like expressions must be positioned in a valid node position so make sure your value is in the right spot. If the value is a string escape it. If the value is an array containing only strings or string like objects (like safeHTML) contours will concatenate and append them as strings. If the value is an array 
- `$@${expression}`: inserts value as an attribute to an element. Must be used within an opening tag at a valid attribute location.
- `$#${expression}`: inserts value of expression in a text node. Must be placed any where a node can be placed.
- `$*${expression}`: inserts value of expression in escapeHTML before sending in the value.

### contours.safeHTML

returns an object

example:

```
let data = [1,2,3,4,5],
  {safeHTML} = contours;

var el = safeHTML`
<div>
  ${data.map((i) => safeHTML`<div>${i}</div>`)}
</div>
`;

document.body.appendChild(el.toFrag());
```

description:
The safeHTML object is an obj with a property named `data` for the string being built. A custom property so contours can recognize it as a safeHTML obj and it has a `toFrag` method that turns the html into a document fragment.

safeHTML is faster than using contours' main function because it doesn't parse and create the created HTML until you tell it to create a document fragment by calling toFrag. This means if your creating 1000s of elements safeHTML is the way to go. The only down side is that you can only insert strings, safeHTML objects, or arrays containing only those two. You cannot add nodes into safeHTML.

### contours.attributes()

Usage: `contours.attributes({
  propertyOfAttribute: valueOfAttribute,
  moreProps: andValues
})`

function declaration: `contours.attributes(object)`

return value: object with added special property which allows contours template tag function to interpret it as an element which holds attributes for the given DOM node it's placed on.

example:

```
var showBlueBackground = false;
var attrs = {
  onclick: function () {
    showBlueBackground = !showBlueBackground; // toggle showBlueBackground between true and false
    this.style.backgroundColor = showBlueBackground ? "blue" : ""; // The ? and the : is the ternary operator.
  },
  class: "someClass",
  style: "padding: 10px; margin: 10px;"
}

var el = contours`
  <div ${contours.attributes(attrs)}>Click Me!</div>
`;

document.body.appendChild(el);
```

This functions main purpose is to you set a DOM nodes attributes within a contours template tag function. It calls `Element.setAttribute()` internally. It is used in the contours template tag function in interpolation brackets wherever a normal HTML attribute could be placed in your markup.  When setting the style property its value can be either a style string or an object with camelCase letters or strings of the proper css style property. The camelCase properties will be converted to kabob-case internally for the style attributes provided. The use of a property starting with "on" e.g. "onclick" will use addEventListener (for the event with the name of the string with the "on" ommited e.g. "onmouseout" property will listen for "mouseout" events) on the target element internally. This works with custom events as well just append on to the beginning of the event name when adding it as a property to the object sent into the attributes function.

### contours.custom()

Usage: `contours.custom({
  scripts: false
})`

function declaration: `contours.attributes(object)`

return value: returns the contours main template tag function with options waiting to be applied.

example:

```
// contours template tag function with all non-default options applied
var myContours = contours.custom({
  includeScripts: true
});

document.body.appendChild(myContours`
  <div>${document.createTextNode("Hey there buckaroo!")}</div>
  <script>console.log("Look scripts and multiple roots!");</script>
`);
document.body.appendChild(contours`<div>${document.createTextNode("Default options again no change to main contours function.")}</div>`);
```

Curries the contours function to supply your options at a time when the template tag function is called. Can be stored in a variable like above or used Immediately after like below:

```
document.getElementById("app").appendChild(
  contours.custom({
    includeScripts: true
  })`
    <div>
      <div>${document.createTextNode("Here be dragons!")}</div>
      <script>console.log("Script tags included, but not multiple roots.");</script>
    </div>
  `
);
```





License
---
### MIT

Copyright (c) 2016 John Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
