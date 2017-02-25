let rows = 1000;
let columns = 10;
var fragment;
var frag;
var safeHTML = contours.safeHTML;

function reduceFrag (arr, cbFunc) {
    arr.reduce((frag, el, i, arr) => {
        frag.appendChild(cbFunc(el, i, arr));
        return frag;
    }, document.createDocumentFragment());
}

var suite = new Benchmark.Suite("Appending divs");
suite.add(`Vanilla JS`, () => {
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
})
    .add(`contours`, () => {
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
    })
    .add(`contours reduce`,() => {
        var frag = contours`
        <table>
            ${reduceFrag([...Array(rows).keys()], (i) => contours`<tr>${
                reduceFrag([...Array(columns).keys()], ()=> contours`<td>${i}</td>`)
                })}</tr>`)
                }
        </table>
        `;
    })
    .add(`part contours part safeHTML`,() => {
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
    })
    .add(`safeHTML`,() => {
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
    })
    .add(`vanilla JS innerHTML`, () => {
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
    })
    .on('complete', reportStat)
    .run();

