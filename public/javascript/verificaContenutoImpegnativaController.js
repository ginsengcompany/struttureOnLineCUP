$(window).on("load", function () {
    // dalla get jQuery precedente (dovrebbe passarli anche la get codice impegnativa che va inserita)
    $('#nome').text("TO DO");
    $('#cognome').text("TO DO");
    $('#codiceImpegnativa').text('TO OD 1234');
});

$(document).ready(function () {
    table = $('#example').DataTable({
        ajax: "/getDescrizioneImpegnativa",
        ajaxSettings: {
            method: "GET",
            cache: false
        },
        columns: [
            {
                "data": null,
                "defaultContent": ''
            },
            {"data": "_id"},
            {"data": "prestazione"},
            {"data": "reparto"}
        ],
        responsive: {
            details: {
                type: 'column',
                target: 'tr'
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: false,
            targets: 0
        }],
        order: [1, 'asc']
    });

    $('#example tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        alert('Hai cliccato ' + data[0] + '\'s riga');
    });
});
