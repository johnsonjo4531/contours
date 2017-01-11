
**contours.js is in early alpha, and may change so be warned.**


contours.js
-----


Contents
---
- [Intro](#examples)
- [Details](#details)
- [API](#api)
  - [contours](#contours)
    - [syntax shortcuts](#syntax-shortcuts)
  - [contours.attributes()](#contoursattributes)
  - [contours.custom()](#contourscustom)
  - [contours.escapeHTML()](#contoursescapehtml)
  - [contours.textNode()](#contourstextnode)
- [License](#license)


Examples
----



Contours.js is a view micro-library for constructing views using ES2015 template strings. Contours is dependency free, but plays well with jQuery.

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

document.body.appendChild(contours`
  <div class="userlist">
    ${userData.map(function (user) {
      return contours`
        <div>
          <img ${contours.attributes({src: user.picture })}>
          ${contours.textNode(user.name)}
        </div>
      `;
      })}
  </div>
`);

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

There are some syntax shortcuts available so the above could element could be created like so:

```
contours`
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
```

The image can also be done like so:
```
contours`
  ...
  <img src="${contours.escapeHTML(user.picture)}">
  ...
`
```

escapeHTML also has a syntax shortcut
```
contours`
  ...
  <img src="$${user.picture}">
  ...
`
```

Details
----


Contours' main function is a template tag function that returns a DOM node. Which looks like this when called.

```
var el = contours`<div>Hello, world!</div>`;
document.body.appendChild(el);
// appends div element to body with content "Hello, world!"
 ```

 Be warned! Contours' main function will create nodes from whatever can be made into a node. This means it is not inherently safe (just as `Element.innerHTML =` and jQuery's main function) at least until you escape text yourself or insert elements as text nodes. This is no problem though with contours' big feature which will be covered in a second.

 The template string passed into contours' main function can also do interpolation like normal template strings
 e.g.
```
var foo = 6;
console.log(`Views from the ${foo}.`)
// logs "Views from the 6."
```
Since it is a template tag function it is able to intercept the values sent into it. Contours big feature is the ability to add DOM nodes, HTMLCollections, NodeLists, and jQuery wrapped elements that are sent in through the interpolation brackets (e.g. `${}`) to the spot they are located in the markup. With this feature you can easily append text nodes in your markup.

```
var evilUserInput = "<script>alert("trying to do malicious user things...")</script>";
var el = contours`<div>This user said: "${document.createTextNode(evilUserInput)}"</div>`;
document.body.appendChild(el);
// safely inserts user input in a div element with the following plain text
// 'This user said: "<script>alert("trying to do malicious user things...")</script>"'
```

Note when you are sending a text node to contours it needs to be in a spot where any element can be so you cannot add them to parts inside html elements like attributes.

Contours also supplies these utilities: `contours.textNode()` which is just a simple wrapper around `document.createTextNode()` and `contours.escapeHTML()` which is just a simple escaping function for HTML entities.

Say we have the following user text, and we wanted to insert it into an attribute safely. The text could be anything, but this user is particularly crafty.
```
var maliciousUsersText = '"> <script>alert("something malicious")</script>';
```

The following is what we don't want to do to insert it into our element.

:warning: Anti-pattern ahead: you should not use the next code sample!
```
document.body.appendChild(
  contours`<div data-title="${maliciousUsersText}">...</div>`
);
```
:no_entry_sign: That is not what we want. It appends the text, but closes our div tag and inserts script tags and that vulnerability could create some potentially dangerous side effects.

If you actually tried the above code you would notice it didn't actually run the alert. That is because by default scripts are not run when created with `.innerHTML()` which is what contours uses. However it is still an antipattern as attributes such as an images onload could be used to run injected JavaScript.

Using `escapeHTML` you can safely enter user created text in an attribute.
```
document.body.appendChild(
  contours`<div data-title="${contours.escapeHTML(maliciousUsersText)}">...</div>`
);
```
:thumbsup: That is better and will safely append the node to the body.

Another alternative to make sure that only the attributes you want added are there is to use `contours.attributes()` which provides a way to use setAttribute on the element it is placed on. It can only be used in an interpolation spot `${}` in the template string provided at any spot where an attribute would go.


There is also the `contours.custom()` which accepts an options object and returns the main contours template tag function so it can be used with those options applied.

```
document.body.appendChild(
  contours.custom({
    includeScripts: true
  })`
    <div>
      First root
    </div>
    <div>
      Second root
    </div>
    <script>console.log("hello script")</script>
  `
);
```

It can also be saved to a variable to be used more than once.

```
var myContours = contours.custom({
  includeScripts: true
});

document.body.appendChild(
  myContours`
    <div>Hello,</div>
    <div>Dave!</div>
    <script>console.log("scripts work with includeScripts option set to true")</script>
  `
);

document.body.appendChild(
  myContours`
    <div>Hey,</div>
    <div>Jeffrey!</div>
  `
);
```

API
----
###### In alphabetical order:

- [contours](#contours)
  - [syntax shortcuts](#syntax-shortcuts)
- [contours.attributes()](#contoursattributes)
- [contours.custom()](#contourscustom)
- [contours.escapeHTML()](#contoursescapehtml)
- [contours.textNode()](#contourstextnode)

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
A template tag function which constructs HTML from the strings and interpolation values provided. Calling this function like the above always uses its default. In order to use nonDefault options use `contours.custom()`. At the start of the contours function a string is constructed which represents all the elements present in the markup. If the interpolation value is a string it is concatenated to the previous string before the interpolation brackets and the string which proceeds the interpolation brackets of the value until the next set of interpolation brackets is hit. If the value in interpolation brackets is a DOM element (including text Nodes), NodeList, HTMLCollection or optionally jQuery element then the string concats markup for a temporary div (or corresponding element for the context) which will later be replaced with the value's elements. This means that the interpolation brackets holding those nodes must be placed in a spot where a Element can be placed in your markup. If the value is the return value of `contours.attributes()` then a simple data attribute will be placed in the location of the interpolation brackets and will later be used to find the node to set the attributes on. If the value is an array the function to concat values to the string is called recursively.

Once this function is finished building the string it will use `.innerHTML()` internally to build the DOM nodes. This means your user entered values are not safe unless they are: placed in a text Node, set in an attribute using `contours.attributes()` or escaped. After `.innerHTML` has been called it will walk through the newly created DOM tree replacing temporary elements with their sent in values and also checking if an element needs it's attributes set.

Things to note are: Contours doesn't run script tags by default you will have to check `contours.custom()` for the option. (note that script can still be run through plain strings in contours through on handlers e.g. onclick)

### syntax shortcuts

The following are syntax shortcuts:

- `$@${expression}`: wraps value of expression in contours.attributes before sending in the value.
- `$#${expression}`: wraps value of expression in contours.textNode before sending in the value.
- `$${expression}`: wraps value of expression in escapeHTML before sending in the value.

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
  optionName: valueForOption
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
### contours.escapeHTML()

Usage: `contours.escapeHTML('Some string you want to escape with possible HTML entities')`

function declaration: `contours.escapeHTML(string)`

return value: an HTML escaped string.

example:
```
document.appendChild(
  contours`
    <div data-attribute="${contours.escapeHTML("a user's string with possible malicous content")}">Hello contours</div>
  `
);
```
A simple HTML escape.

Escapes the values on the left for the values on the right:

```
'&' : '&amp;'
'<' : '&lt;'
'>' : '&gt;'
'"' : '&quot;'
"'" : '&#39;'
'/' : '&#x2F;'
```

### contours.textNode()

Usage: `contours.textNode("Some string you want as a textNode")`

function declaration: `contours.textNode(string)`

example:
```
document.appendChild(
  contours`
    <div>
      ${contours.textNode("Just a text Node good for user entered text")}
      ${document.createTextNode("You can use me as pure JavaScript an alternative to the above.")}
    </div>
  `
);
```

description:
A simple wrapper around `document.createTextNode()`. It just feeds its input into document.createTextNode. The reason for creating it was simply for a shorter method name. When placing it in the markup of a contours template tag function it should only be used where a DOM element can be placed that means no placing it in opening or closing tags.





License
---
### MIT

Copyright (c) 2016 John Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
