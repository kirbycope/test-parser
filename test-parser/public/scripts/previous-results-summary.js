var activePoints;

function drawChartLastTen() {
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
    var dataLabels = [];
    var dataSet1 = [];
    var dataSet2 = [];
    for (var j = 0; j < lastTenResultsSets.length; j++) {
        dataLabels.push(lastTenResultsSets[j].unixtimestamp);
        var passedCount = 0;
        try { passedCount = lastTenResultsSets[j].results.filter(function (o) { return o.outcome === "Failed"; }).length; }
        catch (err) { /* do nothing */ }
        dataSet1.push(passedCount);
        var failedCount = 0;
        try { failedCount = lastTenResultsSets[j].results.filter(function (o) { return o.outcome === "Passed"; }).length }
        catch (err) { /* do nothing */ }
        dataSet2.push(failedCount);
    }
    var barChartData = {
        labels: dataLabels,
        datasets: [
            {
                label: "Failed",
                backgroundColor: chartColors.red,
                data: dataSet1
            },
            {
                label: "Passed",
                backgroundColor: chartColors.green,
                data: dataSet2
            }
        ]
    };
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: 'From Left to Right: Newest to Oldest'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
    
    // https://stackoverflow.com/a/30900874/1106708
    document.getElementById("canvas").onclick =
        function (evt) {
            activePoints = window.myBar.getElementsAtEvent(evt);
            var unixtimestamp = activePoints[0]._model.label;
            if (unixtimestamp) {
                window.location = "/app/results/" + unixtimestamp;
            }
        };
}
