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
        headers: {
            "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZmVkNWM2Mjc1MTNiN2ZiYjI5Yjc2MCIsImlhdCI6MTUzMTI5NTc3M30.BQGMg3W-bhpziOSRotEOAnazPLSsWyIlFridkhBbo_s"
        },
        url: "http://192.168.125.24:3001/auth/me",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
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



                $.ajax({
                    type: "POST",
                    headers: {
                        "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZmVkNWM2Mjc1MTNiN2ZiYjI5Yjc2MCIsImlhdCI6MTUzMTI5NTc3M30.BQGMg3W-bhpziOSRotEOAnazPLSsWyIlFridkhBbo_s",
                        "struttura": "150907"
                    },
                    data: JSON.stringify(data[nomeSelezionato]),
                    url: "http://192.168.125.24:3001/auth/listaappuntamenti",
                    dataType: "json",

                    contentType: 'application/json',
                    success: function (data, textStatus, jqXHR) {
                        if(data.empty)
                            console.log(textStatus);

                        else{
                            listaAppuntamenti = data;
                            console.log(listaAppuntamenti);
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
                                        data:           null,
                                        defaultContent: ''
                                    },

                                    { title:  "IMPEGNATIVA",
                                        data : "codiceImpegnativa" }
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
                                    // Open this row
                                    console.log(row.data());
                                    let app = row.data().appuntamenti;
                                    console.log(app);
                                    row.child( format(app)).show();

                                    tr.addClass('shown');
                                }


                            } );
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $('#test').hide();
                        $('#barra').hide();
                        $('#labelNessunAppuntamento').text("Nessun appuntamento per l'assistito selezionato");
                        $('#labelNessunAppuntamento').show();

                        console.log(textStatus+"ciao");


                    }
                    /*let result = data.findIndex(function(object) {
                        return object.nomeCompletoConCodiceFiscale === nomeSelezionato;
                    });*/
                });

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
});
