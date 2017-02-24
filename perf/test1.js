// this is written in es6 this will only work in modern browsers
// make sure contours is not performing worse than O(n^2)
var numDivs = 10000;
let time = getPerf(() => {
    numDivs = numDivs;
    var fragment = document.createDocumentFragment();
    for(let i = 0; i < numDivs; ++i){
        var newDiv = document.createElement('div');

        newDiv.innerHTML = 'Actually, the DOM is fast.';

        fragment.appendChild(newDiv);
    }
    document.body.appendChild(fragment);
});

report(`Vanilla JS time: ${time} ms.`);

time = getPerf(() => {
    var innerDivs = Array.from(Array(numDivs).keys())
                    .map(() => contours`<div>Actually the DOM is fast.</div>`);
    var frag = contours`
    <div>
        ${innerDivs}
    </div>
    `;

    document.body.appendChild(frag);
});

report(`contours time: ${time} ms.`);

let safeHTML = contours.safeHTML;
time = getPerf(() => {
    var innerHTML = Array.from(Array(numDivs).keys())
                    .map(() => safeHTML`<div>Actually the DOM is fast.</div>`);
    var frag = safeHTML`
    <div>
        ${innerHTML}
    </div>
    `.toFrag();

    document.body.appendChild(frag);
});

report(`contours.safeHTML time: ${time} ms.`);

time = getPerf(() => {
    var innerHTML = Array.from(Array(numDivs).keys())
                    .map(() => safeHTML`<div>Actually the DOM is fast.</div>`);
    var frag = contours`
    <div>
        ${innerHTML}
    </div>
    `;

    document.body.appendChild(frag);
});

report(`part contours part contours.safeHTML time: ${time} ms.`);

time = getPerf(() => {
    var innerHTML = Array.from(Array(numDivs).keys())
                    .map(() =>`<div>Actually the DOM is fast.</div>`).join("");
    var div = document.createElement("div");

    div.innerHTML = innerHTML;

    document.body.appendChild(div);
});

report(`Vanilla JS innerhtml: ${time} ms.`);
