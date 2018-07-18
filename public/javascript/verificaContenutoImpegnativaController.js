$(window).on("load", function () {
    // dalla get jQuery precedente (dovrebbe passarli anche la get codice impegnativa che va inserita)
    $('#nome').text("TO DO");
    $('#cognome').text("TO DO");
    $('#codiceImpegnativa').text('TO OD 1234');
});

$(document).ready(function () {
    let datiPrenotazione = sessionStorage.getItem('datiPrenotazione');
    datiPrenotazione = JSON.parse(datiPrenotazione);
        $.ajax({
            type: "POST",
            data: JSON.stringify(datiPrenotazione.prestazioni),
            url: window.location.href + "/prestazioniErogabili",
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR){
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    /*
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
    */
});
