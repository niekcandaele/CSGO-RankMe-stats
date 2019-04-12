const colours = {
    "red": "rgb(255, 99, 132)",
    "orange": "rgb(255, 159, 64)",
    "yellow": "rgb(255, 205, 86)",
    "green": "rgb(75, 192, 192)",
    "blue": "rgb(54, 162, 235)",
    "purple": "rgb(153, 102, 255)",
    "pink": "rgb(244, 66, 209)",
}

const weapons = ['knife', 'glock', 'hkp2000', `usp_silencer`, `p250`, `deagle`, `elite`, `fiveseven`, `tec9`, `cz75a`, `revolver`, `nova`, `xm1014`, `mag7`, `sawedoff`, `bizon`, `mac10`, `mp9`, `mp7`, `ump45`, `p90`, `galilar`, `ak47`, `scar20`, `famas`, `m4a1`, `m4a1_silencer`, `aug`, `ssg08`, `sg556`, `awp`, `g3sg1`, `m249`, `negev`, `mp5sd`]
const weaponKillsArray = [];

const minutesInSeconds = 60;
const hoursInSeconds = 3600;
const daysInSeconds = 86400;

$(document).ready(async () => {
    // GET the profile data
    const response = await getPlayerProfile();
    let historicalData = await getHistoricalData(response.steam);
    // drawHistoricalChart('score', historicalData.map(d => d.score), historicalData.map(d => d.createdAt));
    // Initialize weapon kills data table
    const weaponKillsTable = $("#weapon-kills").DataTable({
        order: [
            [2, "desc"]
        ],
        columns: [{
            render: function (data, type, row, meta) {
                let kdr = row.kills / (parseInt(row.deaths) + 1);
                kdr = kdr.toFixed(2)
                return `<img src="/static/img/weapons/${row.name}.png" class="img-thumbnail" alt="${row.name}">`
            }
        }, {
            data: 'name',
        }, {
            data: 'data',
        }, ]
    });

    // Side wins chart

    var sideConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [],
                backgroundColor: [
                    "rgb(255, 159, 64)", // Orange
                    "rgb(54, 162, 235)", // Blue
                ],
                label: 'Round wins by team'
            }],
            labels: [
                'Terrorist',
                'Counter terrorist'
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Round wins by team'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    var sideCtx = document.getElementById('side-wins').getContext('2d');
    window.sideWinsChart = new Chart(sideCtx, sideConfig);

    // Hits chart

    var hitsOptions = {
        maintainAspectRatio: true,
        spanGaps: false,
        elements: {
            line: {
                tension: 0.000001
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        responsive: true,
    };
    var hitsCtx = document.getElementById('hits-chart').getContext('2d');
    var hitsChart = new Chart(hitsCtx, {
        type: 'radar',
        data: {
            labels: ['Head', 'Stomach', 'Chest', 'Arms', 'Legs'],
            datasets: [{
                backgroundColor: transparentize('#ff0000'),
                borderColor: '#ff0000',
                data: [],
                label: 'Hits'
            }]
        },
        options: hitsOptions
    });

    // C4 chart

    var c4Ctx = document.getElementById('c4-stats').getContext('2d');
    var c4Chart = new Chart(c4Ctx, {
        type: 'bar',
        data: {
            labels: ['Planted', 'Exploded', 'Defused'],
            datasets: [{
                label: 'C4 statistics',
                data: [],
                backgroundColor: [
                    'rgba(255, 206, 86)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 99, 132)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });



    $("#name").text(response.name);

    let kdr = response.kills / (parseInt(response.deaths) + 1);
    kdr = kdr.toFixed(2)

    let hs = (response.headshots / (parseInt(response.kills) + 1) * 100);
    hs = hs.toFixed(0);

    let accuracy = (response.hits / (parseInt(response.shots) + 1) * 100);
    accuracy = accuracy.toFixed(0);

    $("#kdr").text(kdr);
    $("#hs-percent").text(hs + " %");
    $("#accuracy").text(accuracy + " %");
    $("#time-played").text(secondsToHuman(response.connected))

    $("#kills").text(response.kills);
    $("#deaths").text(response.deaths);
    $("#assists").text(response.assists);
    $("#suicides").text(response.suicides);
    $("#tk").text(response.tk);
    $("#mvp").text(response.mvp);

    $("#shots").text(response.shots);
    $("#hits").text(response.hits);
    $("#damage").text(response.damage)
    $("#hits-per-kill").text(parseFloat(response.hits / response.kills).toFixed(2));
    $("#damage-per-hit").text(parseFloat(response.damage / response.hits).toFixed(2));

    let lastConnectedDate = new Date(parseInt(response.lastconnect) * 1000);
    $("#last-connected").text(`${lastConnectedDate.toLocaleDateString()} ${lastConnectedDate.toLocaleTimeString()}`)

    for (const weapon of weapons) {
        weaponKillsArray.push({
            name: weapon,
            data: response[weapon]
        })
    }
    drawDataTable(weaponKillsArray, weaponKillsTable);

    sideWinsChart.data.datasets[0].data.push(response.rounds_tr);
    sideWinsChart.data.datasets[0].data.push(response.rounds_ct);
    sideWinsChart.update();

    hitsChart.data.datasets[0].data = [response.head, response.stomach, response.chest, parseInt(response.left_arm) + parseInt(response.right_arm), parseInt(response.left_leg) + parseInt(response.right_leg)];
    hitsChart.update();

    c4Chart.data.datasets[0].data = [response.c4_planted, response.c4_exploded, response.c4_defused];
    c4Chart.update();
})

function getIdFromUrl() {
    const splitPageUrl = window.location.pathname.split('/');
    return splitPageUrl[splitPageUrl.length - 1];
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

function transparentize(color, opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return Color(color).alpha(alpha).rgbString();
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

function getPlayerProfile() {
    return new Promise((resolve, reject) => {
        // GET the profile data
        $.ajax({
            type: "GET",
            url: "/api/player/" + getIdFromUrl(),
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

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

function drawHistoricalChart(dataTitle, data, dataLabels) {
    var config = {
        type: 'line',
        data: {
            labels: dataLabels,
            datasets: [{
                label: dataTitle,
                fill: false,
                backgroundColor: "rgb(54, 162, 235)",
                data: data
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
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
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };

    var ctx = document.getElementById('historical-chart').getContext('2d');
    window.myLine = new Chart(ctx, config);
}