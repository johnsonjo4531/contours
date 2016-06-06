function loader() {
  var maliciousUsersText = '"> <script>alert("something malicious")</script>';

  document.body.appendChild(
    contours`<div data-title="${maliciousUsersText}">...</div>`
  );

  document.body.appendChild(
    contours`<img src="http://placehold.it/40x40" onload="alert('test');this.parentNode.removeChild(this);" />`
  );
}
