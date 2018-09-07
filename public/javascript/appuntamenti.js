//nasconde la tabella degli appuntamenti
$("#tableAppuntamenti").hide();
let descImpegnativa, dataAppuntamento, dataAccettazione, datiAnnullamento;
/*
Crea le righe degli appuntamenti passati come argomento nella function
 */
function format(d) {
    let x = "";
    for (let i = 0; i < d.length; i++) {
        x = x +
            '<tr style="background-color: #6C94B2">' +
            '<th style="font-weight: bold; color:white " >Prestazione:</th>' +
            '<td  style="color: white">' + d[i].desprest + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th style="font-weight: bold;">Data appuntamento:</th>' +
            '<td>' + d[i].dataappuntamento + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th style="font-weight: bold">Ora appuntamento:</th>' +
            '<td>' + d[i].oraappuntamento + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th style="font-weight: bold">Ubicazione reparto:</th>' +
            '<td>' + d[i].reparti[0].ubicazioneReparto + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th style="font-weight: bold">Reparto:</th>' +
            '<td>' + d[i].reparti[0].descrizione + '</td>' +
            '</tr>';
    }
    return '<table   cellpadding="15" cellspacing="10"  border="0.5" align="center"  style="padding-left:50px; width:75%;" >' +
        x +
        '</table>';
}
//nasconde la barra di caricamento
$('#barra').hide();
let listaAppuntamenti;
$(document).ready(function () {
    $('.mdb-select').material_select(); //inizializza le select material
    let selectNome = $("#selectContatto");
    //REST Popola la select dei contatti
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
            data.sort(function (a, b) {
                return (a.nomeCompletoConCodiceFiscale > b.nomeCompletoConCodiceFiscale) ? 1 : ((b.nomeCompletoConCodiceFiscale > a.nomeCompletoConCodiceFiscale) ? -1 : 0);
            });
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona Assistito" + '</option>');
            for (let i = 0; i < data.length; i++) {
                selectNome.append('<option value="' + i + '">' + data[i].nomeCompletoConCodiceFiscale + '</option>');
            }
            $('.mdb-select').material_select();
            //Gestisce l'evento on change sulla select dei contatti del care giver
            $('#selectContatto').on('change', function () {
                $("#rowAutoFill").show();
                let nomeSelezionato = $("#selectContatto option:selected").val();
                /*let result = data.findIndex(function(object) {
                    return object.nomeCompletoConCodiceFiscale === nomeSelezionato;
                });*/
                $('#labelNessunAppuntamento').hide();
                $('#barra').show();
                $('#test').hide();
                //REST lista appuntamenti del contatto scelto
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(data[nomeSelezionato]),
                    url: window.location.href + "/ListaAppuntamenti",
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (data, textStatus, jqXHR) {
                        if (!data.empty) { //La lista appuntamenti non è vuota, popola la tabella
                            listaAppuntamenti = data;
                            $('#tableAppuntamenti').dataTable().fnDestroy();
                            $('#tableAppuntamenti').empty();
                            let table = $("#tableAppuntamenti").DataTable({
                                language: {
                                    url: '../localisation/it-IT.json'
                                },
                                data: listaAppuntamenti,
                                columns: [
                                    {
                                        className: 'details-control',
                                        orderable: false,
                                        width: 30,
                                        data: null,
                                        defaultContent: ''
                                    },
                                    {
                                        className: 'delete-control',
                                        orderable: false,
                                        width: 30,
                                        data: null,
                                        defaultContent: ''
                                    },
                                    {
                                        title: "DESCRIZIONE",
                                        data: null, render: function (data, type, row) {
                                            for (let i = 0; i < data.appuntamenti.length; i++) {
                                                descImpegnativa = data.appuntamenti[i].desprest;
                                            }
                                            return descImpegnativa;
                                        }
                                    },
                                    {
                                        title: "DATA APPUNTAMENTO",
                                        data: null, render: function (data, type, row) {
                                            for (let i = 0; i < data.appuntamenti.length; i++) {
                                                dataAppuntamento = data.appuntamenti[i].dataappuntamento;
                                            }
                                            return dataAppuntamento;
                                        }
                                    },
                                    {
                                        title: "IMPEGNATIVA",
                                        data: null, render: function (data, type, row) {
                                            console.log(data);
                                            if (data.codiceImpegnativa !== "" && data.codiceImpegnativa != null) {
                                                return data.codiceImpegnativa;
                                            }
                                            else
                                                for (let i = 0; i < data.appuntamenti.length; i++) {
                                                    if (data.appuntamenti[i].tipoprenotazione === "L")
                                                        data.codiceImpegnativa = "Prenotazione ALPI";
                                                    else if (data.appuntamenti[i].tipoprenotazione === "A")
                                                        data.codiceImpegnativa = "Prenotazione Ambulatoriale";
                                                    else if (data.appuntamenti[i].tipoprenotazione === "I")
                                                        data.codiceImpegnativa = "Prenotazione Interna";
                                                    else if (data.appuntamenti[i].tipoprenotazione === "D")
                                                        data.codiceImpegnativa = "Prenotazione Domiciliare";
                                                    else if (data.appuntamenti[i].tipoprenotazione === "P")
                                                        data.codiceImpegnativa = "Prenotazione PACC";
                                                }
                                            return data.codiceImpegnativa;
                                        }
                                    },
                                ],
                                rowGroup: {
                                    dataSrc: "codiceImpegnativa"
                                }
                            });
                            $('#test').show();
                            $('#barra').hide();
                            /*for(let i = 0; i < listaAppuntamenti.length; i++) {
                                for (let j = 0; j < listaAppuntamenti[i].appuntamenti.length; j++)
                                    if (listaAppuntamenti[i].appuntamenti[j].dataaccettazione === "" ||listaAppuntamenti[i].appuntamenti[j].dataaccettazione === null)
                                        console.log(listaAppuntamenti[i].appuntamenti[j].dataaccettazione);
                            }*/
                            //Gestisce il click per visualizzare in dettaglio l'appuntamento selezionato
                            $('#tableAppuntamenti tbody').on('click', 'td.details-control', function () {
                                let tr = $(this).closest('tr');
                                let row = table.row(tr);
                                if (row.child.isShown()) {
                                    // This row is already open - close it
                                    row.child.hide();
                                    tr.removeClass('shown');
                                }
                                else {
                                    let app = row.data().appuntamenti;
                                    row.child(format(app)).show();
                                    tr.addClass('shown');
                                }
                            });
                            //Gestisce l'eliminazione dell'appuntamento selezionato
                            $('#tableAppuntamenti tbody').on('click', 'td.delete-control', function () {
                                let tr = $(this).closest('tr');
                                let row = table.row(tr);
                                for (let i = 0; i < row.data().appuntamenti.length; i++) {
                                    dataAccettazione = row.data().appuntamenti[i].dataaccettazione;
                                    if (row.data().appuntamenti[i].dataaccettazione !== "" && row.data().appuntamenti[i].dataaccettazione !== null) {
                                        $("#labelCentralModal").text("Non è possibile eliminare una prenotazione già accettata");
                                        $("#centralModal").modal();
                                    }
                                }
                                if (dataAccettazione === "" || dataAccettazione === null) {
                                    $("#labelEliminaImpegnativa").text("");
                                    $("#labelEliminaImpegnativa").append("Sei sicuro di voler eliminare tutti gli appuntamenti inerenti all'impegnativa: <br>" + '<b>' + row.data().codiceImpegnativa) + '</b>';
                                    datiAnnullamento = {
                                        codiceImpegnativa: row.data().codiceImpegnativa,
                                        assistito: {
                                            codice_fiscale: row.data().assistito.codice_fiscale
                                        }
                                    };
                                    $("#centralModalDanger").modal();
                                }
                                $("#btnAnnullaImpegnativa").click(function () {
                                    $('#tableAppuntamenti').parents('div.dataTables_wrapper').first().hide();
                                    $("#tableAppuntamenti").hide();
                                    $("#barra").show();
                                    $.ajax({
                                        type: "POST",
                                        data: JSON.stringify(datiAnnullamento),
                                        url: window.location.href + "/annullaimpegnativa",
                                        dataType: "json",
                                        contentType: 'application/json',
                                        success: function (data, textStatus, jqXHR) {
                                            $("#barra").hide();
                                            $("#labelCentralModal").text(data);
                                            $("#centralModal").modal();
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            $("#labelCentralModal").text(jqXHR.responseText);
                                            $("#centralModal").modal();
                                        }
                                    })
                                });
                            });
                            $('#tableAppuntamenti').parents('div.dataTables_wrapper').first().show();
                            $("#tableAppuntamenti").show();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $('#test').hide();
                        $('#barra').hide();
                        $('#labelNessunAppuntamento').text("Nessun appuntamento per l'assistito selezionato");
                        $('#labelNessunAppuntamento').show();

                    }
                    /*let result = data.findIndex(function(object) {
                        return object.nomeCompletoConCodiceFiscale === nomeSelezionato;
                    });*/
                });

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
});
//Esegue il reload della pagina
$('#centralModal').on('hidden.bs.modal', function () {
    location.reload();
});