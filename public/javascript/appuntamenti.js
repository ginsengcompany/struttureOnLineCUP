$("#tableAppuntamenti").hide();
/* Formatting function for row details - modify as you need */
function format ( d ) {

    let x ="";
    for(let i = 0; i<d.length; i++){
        x= x +
            '<tr style="background-color: #6C94B2">'+
            '<th style="font-weight: bold; color:white " >Prestazione:</th>'+
            '<td  style="color: white">'+d[i].desprest+'</td>'+
            '</tr>'+
            '<tr>'+
            '<th style="font-weight: bold;">Data appuntamento:</th>'+
            '<td>'+d[i].dataappuntamento+'</td>'+
            '</tr>'+
            '<tr>'+
            '<th style="font-weight: bold">Ora appuntamento:</th>'+
            '<td>'+d[i].oraappuntamento+'</td>'+
            '</tr>'+
            '<tr>'+
            '<th style="font-weight: bold">Ubicazione reparto:</th>'+
            '<td>'+d[i].reparti[0].ubicazioneReparto+'</td>'+
            '</tr>'+
            '<tr>'+
            '<th style="font-weight: bold">Reparto:</th>'+
            '<td>'+d[i].reparti[0].descrizione+'</td>'+
            '</tr>';
    }

    // `d` is the original data object for the row
    return '<table   cellpadding="15" cellspacing="10"  border="0.5" align="center"  style="padding-left:50px; width:75%;" >'+
        x+
        '</table>';
}
$('#barra').hide();

let  listaAppuntamenti;
$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.mdb-select').material_select();

    let selectNome = $("#selectContatto");
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
            data.sort(function(a,b) {
                return (a.nomeCompletoConCodiceFiscale > b.nomeCompletoConCodiceFiscale) ? 1 : ((b.nomeCompletoConCodiceFiscale > a.nomeCompletoConCodiceFiscale) ? -1 : 0);
            });
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona Assistito" + '</option>');
            for (let i = 0; i < data.length; i++) {
                selectNome.append('<option value="' + i + '">' + data[i].nomeCompletoConCodiceFiscale + '</option>');
            }
            $('.mdb-select').material_select();
            $('#selectContatto').on('change', function () {
                $( "#rowAutoFill" ).show();
                let nomeSelezionato = $( "#selectContatto option:selected" ).val();

                /*let result = data.findIndex(function(object) {
                    return object.nomeCompletoConCodiceFiscale === nomeSelezionato;
                });*/

                $('#labelNessunAppuntamento').hide();
                $('#barra').show();
                $('#test').hide();



                $.ajax({
                    type: "POST",
                    data: JSON.stringify(data[nomeSelezionato]),
                    url: window.location.href + "/ListaAppuntamenti",
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (data, textStatus, jqXHR) {
                        if(!data.empty) {
                            listaAppuntamenti = data;
                            $('#tableAppuntamenti').dataTable().fnDestroy();
                            $('#tableAppuntamenti').empty();

                            var table = $("#tableAppuntamenti").DataTable({
                                language: {
                                    url: '../localisation/it-IT.json'
                                },
                                data:listaAppuntamenti,

                                columns : [
                                    {

                                        className:      'details-control',
                                        orderable:      false,
                                        width:          30,
                                        data:           null,
                                        defaultContent: ''
                                    },
                                    {

                                        className:      'delete-control',
                                        orderable:      false,
                                        width:          30,
                                        data:           null,
                                        defaultContent: ''
                                    },

                                    { title:  "IMPEGNATIVA",
                                        data: null, render: function ( data, type, row ) {
                                            if(data.codiceImpegnativa=="")
                                                data.codiceImpegnativa="Codice mancante";
                                            // Combine the first and last names into a single table field
                                            return data.codiceImpegnativa; }}
                                ],
                                rowGroup:{
                                    dataSrc: "codiceImpegnativa"
                                }


                            });
                            $('#test').show();
                            $('#barra').hide();
                            $('#tableAppuntamenti tbody').on('click', 'td.details-control', function () {
                                var tr = $(this).closest('tr');
                                var row = table.row( tr );
                                if ( row.child.isShown() ) {
                                    // This row is already open - close it
                                    row.child.hide();
                                    tr.removeClass('shown');
                                }
                                else {
                                    let app = row.data().appuntamenti;
                                    row.child( format(app)).show();
                                    tr.addClass('shown');
                                }
                            } );
                            $('#tableAppuntamenti tbody').on('click', 'td.delete-control', function () {
                                var tr = $(this).closest('tr');
                                var row = table.row( tr );
                                $("#labelEliminaImpegnativa").text("");
                                $("#labelEliminaImpegnativa").append("Sei sicuro di voler eliminare tutti gli appuntamenti inerenti all'impegnativa: <br>" + '<b>'+row.data().codiceImpegnativa)+'</b>';
                                $("#centralModalDanger").modal();
                                    $("#btnAnnullaImpegnativa").click(function () {
                                        $("#barra").show();
                                        $.ajax({
                                            type: "POST",
                                            data: JSON.stringify(row.data()),
                                            url: window.location.href + "/annullaimpegnativa",
                                            dataType: "text",
                                            contentType: 'application/json',
                                            success: function (data, textStatus, jqXHR){
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

$('#centralModal').on('hidden.bs.modal', function () {
    location.reload();
});