function getPerf (cb) {
    var startTime = new Date();

    if(typeof cb == "function") {
        cb();
    }

    return new Date() - startTime;
}

function roundDecimal (decCount) {
    let offset = Math.pow(10, decCount);
    return (num) => {
        offset = offset;
        return Math.floor(num*offset)/offset;
    }
}

function reportStat () {
    let fastest = this.filter('fastest')[0];
    document.getElementById("stat-container").appendChild(contours`
    ${this.map((benchmark) => getReport(benchmark, fastest))}
    `);
}

var round = roundDecimal(4);

function getClass (percent) {
    if(percent >= (2/3)*100) {
        return "stat-green";
    } else if(percent <= (1/3)*100) {
        return "stat-red";
    } else {
        return "";
    }
}

function getReport (benchmark, fastest) {
    var percent = roundDecimal(2)((fastest.stats.mean / benchmark.stats.mean)*100);
    return contours.safeHTML`
    <div class="stat-row">
        <div class="stat-name">
            ${benchmark.name}
        </div>
        <div class="stats">
            <div>Mean: ${round(benchmark.stats.mean*1000)} milliseconds</div>
            <div>Std. Deviatio: ${round(benchmark.stats.deviation*1000)} milliseconds</div>
            <div>${percent}%</div>
        </div>
        <div class="overlay ${getClass(percent)}">
        </div>
    </div>
    `;
}