// this is written in es6 this will only work in modern browsers
// make sure contours is not performing worse than O(n^2)
var numDivs = 1000;
let time = getPerf(() => {
    numDivs = numDivs;
    var fragment = document.createDocumentFragment();
    for(let i = 0; i < numDivs; ++i){
        var newDiv = document.createElement('div');
        // newDiv.setAttribute("data-cntrs-srchd", true);
        
        newDiv.innerHTML = 'Actually, the DOM is fast.';

        fragment.appendChild(newDiv);
    }
    document.body.appendChild(fragment);
});

report(`Vanilla JS time: ${time} ms.`);

time = getPerf(() => {
    function getEl () {
        return contours`<div>Actually the DOM is fast.</div>`
    }

    var frag = contours`
    <div>
        ${Array.from(Array(numDivs).keys()).map(getEl)}
    </div>
    `;

    document.body.appendChild(frag);
});

report(`contours time: ${time} ms.`);