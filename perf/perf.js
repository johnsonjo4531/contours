function getPerf (cb) {
    var startTime = new Date();

    if(typeof cb == "function") {
        cb();
    }

    return new Date() - startTime;
}

function report (str) {
    document.body.insertBefore(contours`<div>${str}</div>`, document.body.firstChild);
}