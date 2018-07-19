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
            let messaggio;
            if (data.prestazioni_non_erogabili.length > 0 && data.prestazioni_erogabili.length === 0){ //Tutte le prestazioni non sono erogabili
                $('#paragrafomodalPrenotazione').text("Nessuna prestazione è erogabile");
                $('#centralModalAlert').modal('show');
            }
            else {
                messaggio = "Le seguenti prestazioni non sono erogabili\n";
                for(let i=0;i<data.prestazioni_non_erogabili.length;i++)
                    messaggio += data.prestazioni_non_erogabili[i].desprest + "\n";
                if(data.prestazioni_non_erogabili.length > 0){
                    alert(messaggio);
                }
                let prestazioni = [];
                for (let i=0;i<data.prestazioni_erogabili.length;i++)
                {
                    $.ajax({
                        type: "POST",
                        data: JSON.stringify(data.prestazioni_erogabili[i]),
                        url: window.location.href + "/prelevaReparti",
                        dataType: "json",
                        contentType: 'application/json',
                        success: function (data2, textStatus2, jqXHR) {
                            let rowTable = "";
                            prestazioni.push({
                                prestazione: data.prestazioni_erogabili[i],
                                reparti: data2
                            });
                            rowTable = "<tr>" + "<td>"+ data.prestazioni_erogabili[i].desprest + "</td><td>" +
                                "<select id='selectPrestazione" + i +
                                "' class='mdb-select'><option value='0' selected>" + data2[0].descrizione +
                                "</option>";
                            for (let k=1; k < data2.length; k++){
                                rowTable += "<option value='" + k +
                                    "'>" + data2[k].descrizione +"</option>";
                            }
                            rowTable += "</select></td></tr>";
                            $("#bodyDataTable").append(rowTable);
                            if (i === data.prestazioni_erogabili.length - 1){

                                let table = $('#example').DataTable({
                                    language: {
                                        url: '../localisation/it-IT.json'
                                    }
                                });
                                $("select").material_select();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
                            $('#centralModalAlert').modal('show');
                        }
                    });
                }
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
