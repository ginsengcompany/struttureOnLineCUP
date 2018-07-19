/* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row

    return '<table   cellpadding="15" cellspacing="10" border="0.5" align="center"  style="padding-left:50px; width:100%;" >'+
        '<tr>'+
            '<th style="font-weight: bold">Codice Fiscale:</th>'+
            '<td>'+d.codice_fiscale+'</td>'+
            '<th style="font-weight: bold">Data di Nascita:</th>'+
            '<td>'+d.data_nascita+'</td>'+
            '<th style="font-weight: bold">Luogo di Nascita:</th>'+
            '<td>'+d.luogo_nascita+'</td>'+
        '</tr>'+
        '<tr>'+
            '<th style="font-weight: bold">Sesso:</th>'+
            '<td>'+d.sesso+'</td>'+
            '<th style="font-weight: bold">Comune Residenza:</th>'+
            '<td>'+d.comune_residenza+'</td>'+
            '<th style="font-weight: bold">Indirizzo Residenza:</th>'+
            '<td>'+d.indirizzores+'</td>'+
        '</tr>'+
        '<tr>'+
            '<th style="font-weight: bold">Telefono:</th>'+
            '<td>'+d.telefono+'</td>'+
            '<th style="font-weight: bold">Email:</th>'+
            '<td>'+d.email+'</td>'+
            '<th style="font-weight: bold">Extra info:</th>'+
            '<td>'+d.prenota+'</td>'+
        '</tr>'+
        '</table>';
}

$(document).ready(function() {
    var table = $('#example').DataTable( {

        language: {
            url: '../localisation/it-IT.json'
        },

        ajax :{
            url: "http://ecuptservice.ak12srl.it/auth/me",
            type: 'GET',
            dataType: 'json',
            dataSrc:'',
            headers: {
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZmVkNWM2Mjc1MTNiN2ZiYjI5Yjc2MCIsImlhdCI6MTUzMTI5NTc3M30.BQGMg3W-bhpziOSRotEOAnazPLSsWyIlFridkhBbo_s"
            }
        },

        columns : [
            {
                className:      'details-control',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
            { data : "nome" },
            { data : "cognome" }
        ],
        order: [[1, 'asc']]
    } );

    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );

});

