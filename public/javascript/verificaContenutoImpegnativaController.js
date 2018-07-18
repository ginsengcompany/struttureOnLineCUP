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
            let messaggio, indiceNonErogabili = [];
            for(let i=0;i<data.length;i++){
                if (!data[i].erogabile)
                    indiceNonErogabili.push(i);
            }
            if (indiceNonErogabili.length === data.length){ //Tutte le prestazioni non sono erogabili
                $('#paragrafomodalPrenotazione').text("Nessuna prestazione è erogabile");
                $('#centralModalAlert').modal('show');
            }
            else if(indiceNonErogabili.length < data.length && indiceNonErogabili > 0){
                messaggio = "Le seguenti prestazioni non sono erogabili\n";
                for(let i=0;i<indiceNonErogabili.length;i++)
                    messaggio += data[indiceNonErogabili[i]] + "\n";
            }else {
                table = $('#example').DataTable({
                    language: {
                        url: '../localisation/it-IT.json'
                    },
                    data: data,
                    columns: [
                        {
                            "data": null,
                            "defaultContent": ''
                        },
                        {"data": "desprest"}
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
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
            $('#centralModalAlert').modal('show');
        }
    });
    /*

    $('#example tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        alert('Hai cliccato ' + data[0] + '\'s riga');
    });
    */
});
