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

    $("#score-inc h5").text(`${$("#score-inc h5").text()}: ${sortedByScore[0].name} +${sortedByScore[0].scoreDifference}`)
    $("#kills-inc h5").text(`${$("#kills-inc h5").text()}: ${sortedByKills[0].name} +${sortedByKills[0].killsDifference}`)

    const mostKillsPlayer = _.find(playerData, {
        steam: sortedByKills[0].steamId
    });
    const mostScorePlayer = _.find(playerData, {
        steam: sortedByScore[0].steamId
    });

    $("#kills-inc a").attr("href", `/player/${mostKillsPlayer.id}`)
    $("#score-inc a").attr("href", `/player/${mostScorePlayer.id}`)


    drawLineChart('Score', groupedData[sortedByScore[0].steamId].map(d => d.score), groupedData[sortedByScore[0].steamId].map(d => d.createdAt), 'score-increase-chart')
    drawLineChart('Kills', groupedData[sortedByScore[0].steamId].map(d => d.kills), groupedData[sortedByScore[0].steamId].map(d => d.createdAt), 'kills-increase-chart')

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