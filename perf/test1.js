// this is written in es6 this will only work in modern browsers
// make sure contours is not performing worse than O(n^2)
var numDivs = 100;
let safeHTML = contours.safeHTML;
var suite = new Benchmark.Suite("Appending divs");
suite.add(`Vanilla JS`, () => {
    numDivs = numDivs;
    var fragment = document.createDocumentFragment();
    for(let i = 0; i < numDivs; ++i){
        var newDiv = document.createElement('div');

        newDiv.innerHTML = 'Actually, the DOM is fast.';

        fragment.appendChild(newDiv);
    }
})
    .add(`contours`, () => {
        var innerDivs = Array.from(Array(numDivs).keys())
                        .map(() => contours`<div>Actually the DOM is fast.</div>`);
        var frag = contours`
        <div>
            ${innerDivs}
        </div>
        `;
    })
    .add(`contours.safeHTML`, () => {
        var innerHTML = Array.from(Array(numDivs).keys())
                        .map(() => safeHTML`<div>Actually the DOM is fast.</div>`);
        var frag = safeHTML`
        <div>
            ${innerHTML}
        </div>
        `.toFrag();
    })
    .add(`part contours part contours.safeHTML`, () => {
        var innerHTML = Array.from(Array(numDivs).keys())
                        .map(() => safeHTML`<div>Actually the DOM is fast.</div>`);
        var frag = contours`
        <div>
            ${innerHTML}
        </div>
        `;
    })
    .add(`Vanilla JS innerhtml`, () => {
        var innerHTML = Array.from(Array(numDivs).keys())
                        .map(() =>`<div>Actually the DOM is fast.</div>`).join("");
        var div = document.createElement("div");

        div.innerHTML = innerHTML;
    })
    .on('complete', reportStat)
    .run();
