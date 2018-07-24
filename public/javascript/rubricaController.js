/* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row

    return '<table   cellpadding="15" cellspacing="10" border="0" align="center"  style="padding-left:50px; width:100%;" >'+
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
        '<td colspan="4">'+d.email+'</td>'+
        '</tr>'+
        '</table>';
}
function Modifica ( d ) {
    console.log(d);
    let codFiscale = $('#codiceFiscale');
    let nome = $('#Nome');
    let cognome = $('#Cognome');
    let dataNascita = $('#DataNascita');
    let luogoNascita = $('#LuogoNascita');
    let sesso = $('#Sesso');
    let listaprovinceresidenza = $('#listaprovinceresidenza');
    let listacomuneresidenza = $('#listacomuneresidenza');
    let indirizzo = $('#Indirizzo');
    let Telefono = $('#Telefono');
    let eMail = $('#eMail');


    codFiscale.text(d.codice_fiscale);
    nome.text(d.nome);
    cognome.text(d.cognome);
    dataNascita.text(d.data_nascita);
    luogoNascita.text(d.luogo_nascita);
    if(d.sesso='F')
        sesso.text("Donna");
    else
        sesso.text("Uomo");

    document.getElementById("Indirizzo").value= d.indirizzores;
    document.getElementById("Telefono").value= d.telefono;
    document.getElementById("eMail").value= d.email;
    eMail.on('input',function () {
        $('input[type=text]').val(function () {
            return this.value.toUpperCase();
        });
        if(eMail.value != d.email){
            alert("prova");
        }
    });

}
/* Formatting function for row details - modify as you need */


$(document).ready(function() {
    $('#test').hide();
    $(".button-collapse").sideNav();
    $('.mdb-select').material_select();

    let selectProvinceResidenza = $("#listaprovinceresidenza");
    $("#listaprovinceresidenza").select({ dropdownParent: "#modal-container" });
    $.ajax({
        type: "GET",
        url: "http://ecuptservice.ak12srl.it/comuni/listaprovince",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            $('select[name="listaprovince"]').material_select('destroy');
            for (let i = 0; i < data.length; i++) {
                selectProvinceResidenza.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            $('select[name="listaprovince"]').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    $('#listaprovinceresidenza').on('change', function () {
        let selectComuneResidenza = $("#listacomuneresidenza");
        let send = {codIstat: this.value};
        $.ajax({
            type: "POST",
            url: "http://ecuptservice.ak12srl.it/comuni/listacomuni",
            data: JSON.stringify(send),
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#listacomuneresidenza').material_select('destroy');
                $('#listacomuneresidenza').find('option').remove();
                selectComuneResidenza.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                for (let i = 0; i < data.length; i++) {
                    selectComuneResidenza.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                }
                $('#listacomuneresidenza').material_select();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });

    var table = $('#example').DataTable( {

        language: {
            url: '../localisation/it-IT.json'
        },

        ajax :{
            url: window.location.href + "/contatti",
            type: 'GET',
            dataType: 'json',
            dataSrc:''
        },

        columns : [
            {
                className:      'details-control',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
            { data : "nome" },
            { data : "cognome" },
            {

                className:      'edit-control',
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
            }
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
    $('#example tbody').on('click', 'td.delete-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        $("#labelEliminaImpegnativa").text("");
        $("#labelEliminaImpegnativa").append("Sei sicuro di voler eliminare il contatto: <br>" + '<b>'+row.data().nome + ' ' +row.data().cognome);
        $("#centralModalDanger").modal();
        $("#btnconfermaEliminazione").click(function (e) {
            $.ajax({
                type: "POST",
                url: window.location.href + "/eliminaContatto",
                data: JSON.stringify(row.data()),
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {
                    $("#centralModalDanger").hidden;
                    if(jqXHR.status === 200) {

                        $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
                        $('#centralModalAlert').modal('show');
                        setTimeout(function () {
                            window.location.href = 'rubrica';
                        }, 2000);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#paragrafomodalPrenotazione').title("ERRORE");
                    $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
                    $('#centralModalAlert').modal('show');
                    setTimeout(function () {
                        window.location.href = 'rubrica';
                    }, 2000);
                }
            });
        });
    } );
    $('#example tbody').on('click', 'td.edit-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        let d = row.data();
        Modifica(d);
        $('#tableprincipale').hide();
        $('#test').show();

        $('#tableModifica').DataTable({

            searching: false,
            paging: false,
            info:false
        });

    } );

});
