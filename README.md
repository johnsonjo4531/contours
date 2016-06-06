contours.js
-----

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
        <div >
          <img src="${contours.HTMLEscape(user.picture)}"> ${contours.textNode(user.name)}
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
      <img src="http://placehold.it/40x40"> Joe Jackson
    </div>
    <div>
      <img src="http://placehold.it/40x40"> Jessica Jackson
    </div>
    <div>
      <img src="http://placehold.it/40x40"> Jimmy Jones
    </div>
  </div>
</body>
```


Contours' main function is a template tag function that returns a DOM node. Which looks like this when called.

```
var el = contours`<div>Hello, world!</div>`;
document.body.appendChild(el); // appends div element to body with content "Hello, world!"
 ```

 Be warned! Contours' main function will create nodes from whatever can be made into a node. This means it is not inherently safe (just as `Element.innerHTML =` and jQuery's main function) at least until you escape text yourself or insert elements as text nodes. This is no problem though with contours' big feature.

 The template string passed into contours' main function can also do interpolation like normal template strings
 e.g.
```
var foo = 6;
console.log(`Views from the ${foo}.`) // logs "Views from the 6."
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

Contours also supplies these utilities: `contours.textNode()` which is just a simple wrapper around `document.createTextNode()` and `contours.HTMLEscape()` which is just a simple escaping function for HTML entities.

Say we have the following user text. and we wanted to insert it into an attribute safely. The text could be anything, but this user is particularly crafty.
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

Using `HTMLEscape` you can safely enter user created text in an attribute.
```
document.body.appendChild(
  contours`<div data-title="${contours.HTMLEscape(maliciousUsersText)}">...</div>`
);
```
:thumbsup: That is better and will safely append the node to the body.

License: MIT
---
Copyright (c) 2016 John Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
