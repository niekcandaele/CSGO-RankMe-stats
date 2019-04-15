function getHistoricalData(steam, startDate, endDate) {
    return new Promise((resolve, reject) => {
        // GET the profile data
        $.ajax({
            type: "GET",
            url: "/api/historicalData/",
            data: {
                steam,
                startDate,
                endDate
            },
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

function drawDataTable(data, table) {
    table.clear();
    if (data) {
        for (const row of data) {
            table.row.add(row);
        }
    }
    table.draw();
}

function secondsToHuman(seconds) {

    let days = Math.floor(seconds / daysInSeconds);
    seconds = seconds % daysInSeconds;
    let hours = Math.floor(seconds / hoursInSeconds);
    seconds = seconds % hoursInSeconds;
    let minutes = Math.floor(seconds / minutesInSeconds);
    seconds = seconds % minutesInSeconds;
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
}

function drawLineChart(dataTitle, data, dataLabels, elementId) {
    var config = {
        type: 'line',
        data: {
            labels: dataLabels.map(createdAt => {
                let date = new Date(createdAt);
                return date.toLocaleDateString();
            }),
            datasets: [{
                label: dataTitle,
                fill: false,
                backgroundColor: "rgb(54, 162, 235)",
                data: data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: false,
                text: 'Historical data'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };

    let canvas = document.getElementById(elementId);
    if (canvas !== null) {
        let ctx = canvas.getContext('2d');
        window.historicalData = new Chart(ctx, config);
    }

}