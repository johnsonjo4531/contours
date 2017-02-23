let rows = 10000;
let columns = 10;
let time = getPerf(() => {
    rows = rows;
    rows = rows;
    var fragment = document.createDocumentFragment();
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
    document.body.appendChild(fragment);
});

report(`Vanilla JS time: ${time} ms.`);

time = getPerf(() => {
    var frag = contours`
    <table>
        ${[...Array(rows).keys()].map((i) => {
                return contours`<tr>${
                    [...Array(columns).keys()].map(()=> contours`<td>${i}</td>`)
                }</tr>`
            })
        }
    </table>
    `;

    document.body.appendChild(frag);
});

report(`contours time: ${time} ms.`);

