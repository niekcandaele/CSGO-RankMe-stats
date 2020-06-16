$(document).ready(async () => {
    const overviewTable = $("#overview").DataTable({
        order: [
            [1, "desc"]
        ],
        columns: [{
                render: function (data, type, row, meta) {
                    return `<a href="/player/${row.id}">${row.name}</a>`
                }
            }, {
                data: 'score',
            }, {
                render: function (data, type, row, meta) {
                    let kdr = row.kills / (parseInt(row.deaths) + 1);
                    kdr = kdr.toFixed(2)
                    return kdr
                }
            }, {
                render: function (data, type, row, meta) {
                    let hs = (row.headshots / (parseInt(row.kills) + 1) * 100);
                    hs = hs.toFixed(0);
                    return hs + ' %'
                }
            },
            {
                data: 'kills'
            },
            {
                data: 'deaths'
            }
        ]
    });

    const playerData = await getPlayers();
    const historicalData = await getHistoricalData();

    drawDataTable(playerData, overviewTable)

    const groupedData = _.groupBy(historicalData, 'steam')
    const richData = [];

    for (const steamId of Object.keys(groupedData)) {
        const playerData = groupedData[steamId]

        const oldKills = parseInt(playerData[0].kills);
        const newKills = parseInt(playerData[playerData.length - 1].kills)
        const killsDifference = newKills - oldKills

        const oldScore = parseInt(playerData[0].score);
        const newScore = parseInt(playerData[playerData.length - 1].score)
        const scoreDifference = newScore - oldScore
        richData.push({
            steamId,
            name: playerData[0].name,
            killsDifference,
            scoreDifference
        })
    }

    const sortedByKills = _.orderBy(richData, 'killsDifference', 'desc');
    const sortedByScore = _.orderBy(richData, 'scoreDifference', 'desc');

    const mostKillsPlayer = _.find(playerData, {
        steam: sortedByKills[0].steamId
    });
    const mostScorePlayer = _.find(playerData, {
        steam: sortedByScore[0].steamId
    });

    const topKillsNames = [];
    const topKillsData = [];
    const topScoreNames = [];
    const topScoreData = [];

    for (let index = 0; index < Math.min(10, sortedByScore.length); index++) {
        const runnerUpPlayer = _.find(playerData, {
            steam: sortedByScore[index].steamId
        });
        topScoreNames.push(runnerUpPlayer.name)
        topScoreData.push(groupedData[runnerUpPlayer.steam].map(d => d.score));
        $("#score-inc ol").append(`<li><a href="/player/${runnerUpPlayer.id}"><span class="tab">${runnerUpPlayer.name}</span></a> +${sortedByScore[index].scoreDifference} </li>`);
    }

    for (let index = 0; index < Math.min(10, sortedByKills.length); index++) {
        const runnerUpPlayer = _.find(playerData, {
            steam: sortedByKills[index].steamId
        });
        topKillsNames.push(runnerUpPlayer.name)
        topKillsData.push(groupedData[runnerUpPlayer.steam].map(d => d.kills));
        $("#kills-inc ol").append(`<li><a href="/player/${runnerUpPlayer.id}"><span class="tab">${runnerUpPlayer.name}</span></a> +${sortedByKills[index].killsDifference} </li>`);
    }

    drawLineChart(topScoreNames, topScoreData, groupedData[sortedByScore[0].steamId].map(d => d.createdAt), 'score-increase-chart')
    drawLineChart(topKillsNames, topKillsData, groupedData[sortedByScore[0].steamId].map(d => d.createdAt), 'kills-increase-chart')

});


function getPlayers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/api/overview",
            success: function (response) {
                resolve(response)

            }
        });
    })
}
