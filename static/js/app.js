window.colours = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(25, 241, 252",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(252, 25, 241)",
    "rgb(201, 203, 207)",
    "rgb(0, 255, 76)"
]


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

function drawLineChart(dataTitles, dataArr, dataLabels, elementId) {
    var config = {
        type: 'line',
        data: {
            labels: dataLabels.map(createdAt => {
                let date = new Date(createdAt);
                return date.toLocaleDateString();
            }),
            datasets: []
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

    for (let index = 0; index < dataTitles.length; index++) {
        config.data.datasets.push({
            label: dataTitles[index],
            fill: false,
            backgroundColor: window.colours[index],
            borderColor: window.colours[index],
            data: dataArr[index]
        })

    }

    let canvas = document.getElementById(elementId);
    if (canvas !== null) {
        let ctx = canvas.getContext('2d');
        window.historicalData = new Chart(ctx, config);
    }

}