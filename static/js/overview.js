$(document).ready(() => {
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

    $.ajax({
        type: "GET",
        url: "/api/overview",
        success: function (response) {
            drawDataTable(response, overviewTable)
        }
    });
})

function drawDataTable(data, table) {
    table.clear();
    if (data) {
        for (const row of data) {
            table.row.add(row);
        }
    }
    table.draw();
}