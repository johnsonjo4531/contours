let rows = 1000;
let columns = 10;
var fragment;
let time = getPerf(() => {
    rows = rows;
    fragment = fragment;
    fragment = document.createDocumentFragment();
    var table = document.createElement('table');
    for(let i = 0; i < rows; ++i){
        // newDiv.setAttribute("data-cntrs-srchd", true);
        let tr = document.createElement('tr');
        for(let j = 0; j < columns; ++j) {
            let td = document.createElement('td');

            td.innerHTML = i;

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    fragment.appendChild(table);
});

//document.body.appendChild(fragment);

report(`Vanilla JS time: ${time} ms.`);

var frag;

time = getPerf(() => {
    frag = contours`
    <table>
        ${[...Array(rows).keys()].map((i) => {
                return contours`<tr>${
                    [...Array(columns).keys()].map(()=> contours`<td>${i}</td>`)
                }</tr>`
            })
        }
    </table>
    `;
});

//document.body.appendChild(frag);

report(`contours time map: ${time} ms.`);

function reduceFrag (arr, cbFunc) {
    arr.reduce((frag, el, i, arr) => {
        frag.appendChild(cbFunc(el, i, arr));
        return frag;
    }, document.createDocumentFragment());
}

time = getPerf(() => {
    var frag = contours`
    <table>
        ${reduceFrag([...Array(rows).keys()], (i) => contours`<tr>${
            reduceFrag([...Array(columns).keys()], ()=> contours`<td>${i}</td>`)
            })}</tr>`)
            }
    </table>
    `;
});

report(`contours time reduce: ${time} ms.`);

var safeHTML = contours.safeHTML;
let frag;
time = getPerf(() => {
    frag = contours`
    <table>
        ${[...Array(rows).keys()].map((i) => {
                return safeHTML`<tr>${
                    [...Array(columns).keys()].map(()=> safeHTML`<td>${i}</td>`)
                }</tr>`
            })
        }
    </table>
    `;
});
document.body.appendChild(frag);
report(`contours string time with outer contours: ${time} ms.`);

time = getPerf(() => {
    var html = safeHTML`
    <table>
        ${[...Array(rows).keys()].map((i) => {
                return safeHTML`<tr>${
                    [...Array(columns).keys()].map(()=> safeHTML`<td>${i}</td>`)
                }</tr>`
            })
        }
    </table>
    `;
    frag = html.toFrag();
});

//document.body.appendChild(frag);
report(`contours string time with only safeHTML: ${time} ms.`);

time = getPerf(() => {
    var html = `
    <table>
        ${[...Array(rows).keys()].map((i) => {
                return `<tr>${
                    [...Array(columns).keys()].map(()=> `<td>${i}</td>`).join("")
                }</tr>`
            }).join("")
        }
    </table>
    `;
    var div = document.createElement("div");
    div.innerHTML = html;
});

report(`Vanilla JS innerHTML: ${time} ms.`);

