//Funzione che formatta la riga da inserire nella tabella dei contatti
function format ( d ) {
    return '<table   cellpadding="15" cellspacing="10" border="0" align="center"  style="padding-left:50px; width:100%;" >'+
        '<tr>'+
        '<th style="font-weight: bold">Codice Fiscale:</th>'+
        '<td>'+d.codice_fiscale+'</td>'+
        '<th style="font-weight: bold">Data di Nascita:</th>'+
        '<td>'+d.data_nascita+'</td>'+
        '<th style="font-weight: bold">Luogo di Nascita:</th>'+
        '<td>'+d.luogo_nascita+'</td>'+
        '<th style="font-weight: bold">Sesso:</th>'+
        '<td>'+d.sesso+'</td>'+
        '</tr>'+
        '<tr>'+
        '<th style="font-weight: bold">Provincia Residenza:</th>'+
        '<td>'+d.provincia+'</td>'+
        '<th style="font-weight: bold">Comune Residenza:</th>'+
        '<td>'+d.comune_residenza+'</td>'+
        '<th style="font-weight: bold">Indirizzo Residenza:</th>'+
        '<td>'+d.indirizzores+'</td>'+
        '<th style="font-weight: bold">Telefono:</th>'+
        '<td>'+d.telefono+'</td>'+
        '<th style="font-weight: bold">Email:</th>'+
        '<td colspan="4">'+d.email+'</td>'+
        '</tr>'+
        '</table>';
}

//funzione che gestisce la modfica del contatto selezionato
function Modifica ( d ) {
    //dati non modificabili
    let codFiscale = $('#codiceFiscale');
    let nome = $('#Nome');
    let cognome = $('#Cognome');
    let dataNascita = $('#DataNascita');
    let luogoNascita = $('#LuogoNascita');
    let sesso = $('#Sesso');
    codFiscale.text(d.codice_fiscale);
    nome.text(d.nome);
    cognome.text(d.cognome);
    dataNascita.text(d.data_nascita);
    luogoNascita.text(d.luogo_nascita);
    if(d.sesso ==='F')
        sesso.text("Donna");
    else
        sesso.text("Uomo");
    //dati modificabili
    let selectStatoCivile = $("#statocivile");
    //REST che recupera la lista degli stati civili da inserire nella select
    $.ajax({
        type: "GET",
        url: "http://ecuptservice.ak12srl.it/statocivile",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            for (let i = 0; i < data.length; i++) {
                if( data[i].id === d.codStatoCivile)
                    selectStatoCivile.append('<option value="' + data[i].id + '" selected>' + data[i].descrizione + '</option>');
                else
                    selectStatoCivile.append('<option value="' + data[i].id + '">' + data[i].descrizione + '</option>');
            }
            $('#statocivile').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    let selectProvinceResidenza = $("#listaprovinceresidenza");
    //$('#listaprovinceresidenza').append('<option value="'+d.codIstat +'" selected>' + d.provincia + '</option>');
    $("#listaprovinceresidenza").select({ dropdownParent: "#modal-container" });
    //REST per recuperare la lista delle province
    $.ajax({
        type: "GET",
        url: "http://ecuptservice.ak12srl.it/comuni/listaprovince",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            $('select[name="listaprovince"]').material_select('destroy');
            data.sort(function (a, b) {
                return (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0);
            });
            for (let i = 0; i < data.length; i++) {
                selectProvinceResidenza.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            let provinciares = $("#listaprovinceresidenza").find("option[value='" + d.codIstatProvinciaResidenza + "']");
            provinciares.attr('selected', '');
            $('select[name="listaprovince"]').material_select();
            let selectComuneResidenza = $("#listacomuneresidenza");
            let send = {codIstat: d.codIstatProvinciaResidenza};
            $.ajax({
                type: "POST",
                url: "http://ecuptservice.ak12srl.it/comuni/listacomuni",
                data: JSON.stringify(send),
                dataType: "json",
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {
                    $('#listacomuneresidenza').material_select('destroy');
                    $('#listacomuneresidenza').find('option').remove();
                    data.sort(function (a, b) {
                        return (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0);
                    });
                    selectComuneResidenza.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                    for (let i = 0; i < data.length; i++) {
                        selectComuneResidenza.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                    }
                    let comuneres = $("#listacomuneresidenza").find("option[value='" + d.istatComuneResidenza + "']");
                    comuneres.attr('selected', '');
                    $('#listacomuneresidenza').material_select();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
    $('#listacomuneresidenza').material_select('destroy');
    $('#listacomuneresidenza').find('option').remove();
    //$('#listacomuneresidenza').append('<option value="'+d.istatComuneResidenza+'" selected>' + d.comune_residenza + '</option>');
    $('#listacomuneresidenza').material_select();
    $('#listaprovinceresidenza').on('change', function () {
        let selectComuneResidenza = $("#listacomuneresidenza");
        let send = {codIstat: this.value};
        //REST lista comuni
        $.ajax({
            type: "POST",
            url: "http://ecuptservice.ak12srl.it/comuni/listacomuni",
            data: JSON.stringify(send),
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#listacomuneresidenza').material_select('destroy');
                $('#listacomuneresidenza').find('option').remove();
                data.sort(function (a, b) {
                    return (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0);
                });
                selectComuneResidenza.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                for (let i = 0; i < data.length; i++) {
                    selectComuneResidenza.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                }
                $('#listacomuneresidenza').material_select();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("listacomuni");
                console.log(jqXHR.responseText);
            }
        });
    });
    let btnConferma = $('#ConfermaModifica');// button conferma modifica
    $('#ConfermaModifica').prop("disabled",true);
    document.getElementById("formIndirizzo").value = d.indirizzores;
    $('#formIndirizzo').on('input',function () {
        if( $('#formIndirizzo').value != d.indirizzores){
            $('#ConfermaModifica').prop("disabled",false);
        }
    });
    document.getElementById("formTelefono").value= d.telefono;
    $('#formTelefono').on('input',function () {
        if($('#formTelefono').value != d.telefono){
            $('#ConfermaModifica').prop("disabled",false);
        }
    });
    document.getElementById("formEmail").value= d.email;
    $('#formEmail').on('input',function () {
        if($('#formEmail').value != d.email){
            $('#ConfermaModifica').prop("disabled",false);
        }
    });
    $('#listacomuneresidenza').on('change', function () {
        if($('#listacomuneresidenza').val() != d.istatComuneResidenza){
            $('#ConfermaModifica').prop("disabled",false);
        }
    });
    //Gestisce il click sul pulsante per confermare le modfiche apportate al contatto
    btnConferma.click(function () {
        let isValid = true;
        if(!$('#formTelefono').val() || !document.getElementById("formTelefono").validity.valid || document.getElementById("formTelefono").value.trim()=== '') {
            isValid = false;
            $("#telefonoHelp").fadeIn();
        }else
            $("#telefonoHelp").fadeOut();
        if(!$('#formEmail').val() || !document.getElementById("formEmail").validity.valid || document.getElementById("formEmail").value.trim() === '') {
            isValid = false;
            $("#emailHelp").fadeIn();
        }else
            $("#emailHelp").fadeOut();
        if(!$('#listacomuneresidenza').val()){
            isValid = false;
            $("#comune-residenzaHelp").fadeIn();
        }else
            $("#comune-residenzaHelp").fadeOut();
        if(!$('#listaprovinceresidenza').val() && $('#listacomuneresidenza').val() != d.istatComuneResidenza ){
            isValid = false;
            $("#provincia-residenzaHelp").fadeIn();
        }else
            $("#provincia-residenzaHelp").fadeOut();
        if(!$('#statocivile').val()){
            isValid = false;
            $("#stato-civileHelp").fadeIn();
        }else
            $("#pstato-civileHelp").fadeOut();
        if(!$('#formIndirizzo').val() || !document.getElementById("formIndirizzo").validity.valid || document.getElementById("formIndirizzo").value.trim()=== '') {
            isValid = false;
            $("#indirizzoHelp").fadeIn();
        }else
            $("#indirizzoHelp").fadeOut();
        if (isValid) {
            let codicestatocivile = $('#statocivile').val().toUpperCase();
            let statocivile = $("#statocivile").find("option[value='" + codicestatocivile + "']").text().toUpperCase();
            //dati personali
            let email = $('#formEmail').val();
            let telefono = $('#formTelefono').val().toUpperCase();
            let provinciaresidenza;
            let comuneresidenza;
            let codicecomuneresidenza;
            if($('#listacomuneresidenza').val() == d.istatComuneResidenza){
                 provinciaresidenza = d.provincia;
                 codicecomuneresidenza = d.istatComuneResidenza;
                 comuneresidenza = d.comune_residenza;
            }
            else{
                  codiceprovinciaresidenza = $("#listaprovinceresidenza").val().toUpperCase();
                  provinciaresidenza = $("#listaprovinceresidenza").find("option[value='" + codiceprovinciaresidenza + "']").text().toUpperCase();
                 let codicecomuneresidenza = $('#listacomuneresidenza').val().toUpperCase();
                  comuneresidenza = $("#listacomuneresidenza").find("option[value='" + codicecomuneresidenza + "']").text().toUpperCase();
            }
            let indirizzo = $('#formIndirizzo').val().toUpperCase();
            console.log(d);
            let assistito = {
                email: email,
                nome: d.nome,
                cognome: d.cognome,
                sesso: d.sesso,
                codice_fiscale: d.codice_fiscale,
                telefono: telefono,
                codStatoCivile: codicestatocivile,
                data_nascita: d.data_nascita,
                luogo_nascita: d.luogo_nascita,
                istatComuneNascita: d.istatComuneNascita,
                provincia: provinciaresidenza,
                comune_residenza: comuneresidenza,
                indirizzores: indirizzo,
                istatComuneResidenza: d.codicecomuneresidenza,
                statocivile: statocivile
            };
            //REST invia i dati del contatto modificati
            $.ajax({
                type: "POST",
                url: window.location.href +  "/modificaContatto",
                data: JSON.stringify(assistito),
                dataType: "json",
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {
                    if(jqXHR.status === 200) {
                        $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
                        $('#centralModalAlert').modal('show');
                        setTimeout(function () {
                            window.location.href = 'rubrica';
                        }, 2000);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
                    $('#centralModalAlert').modal('show');
                    setTimeout(function () {
                        window.location.href = 'rubrica';
                    }, 2000);
                }
            });
        }
    });
}

$(document).ready(function() {
    $('#test').hide(); //nasconde la form di modifica del contatto
    $('.mdb-select').material_select(); // Rende le select material
    //Chiamata REST per la ricezione dei contatti
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            let contatti = data;
            let table = $('#example').DataTable( {
                language: { //carica la lingua della tabella
                    url: '../localisation/it-IT.json'
                },
                data: contatti, //contenuto della tabella (contatti dell'utente)
                columns : [ //definisce le colonne
                    { //prima colonna per aprire la riga e visualizzare i dati del contatto selezionato
                        className:      'details-control',
                        orderable:      false,
                        data:           null,
                        defaultContent: ''
                    },
                    { data : "nome" }, //nome del contatto
                    { data : "cognome" }, //cognome del contatto
                    { // colonna con il button edit del contatto
                        className:      'edit-control',
                        orderable:      false,
                        width:          30,
                        data:           null,
                        defaultContent: ''
                    },
                    { //elimina contatto
                        data: null,
                        render: function (data, type, row) {
                            if(row.codice_fiscale !== contatti[0].codice_fiscale)
                                return '<img src="/img/deleteIcon.png" class="delete-control"/>';
                            return '<img src="" style="display: none;"/>';
                        },
                        targets: [4],
                    }
                ],
                order: [[1, 'asc']] //ordinamento delle righe in tabella
            });
            // Evento di apertura e chiusura della visualizzazione in dettaglio dei dati del contatto selezionato
            $('#example tbody').on('click', 'td.details-control', function () {
                let tr = $(this).closest('tr');
                let row = table.row( tr );
                //Se questa riga è aperta allora viene chiusa
                if ( row.child.isShown() ) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else { //altrimenti apri
                    row.child( format(row.data()) ).show();
                    tr.addClass('shown');
                }
            } );
            // Evento click sul tasto per eliminare il contatto
            $('#example tbody').on('click', 'td img.delete-control', function () {
                let tr = $(this).closest('tr');
                let row = table.row( tr );
                $("#labelEliminaImpegnativa").text("");
                if(row.data().codice_fiscale !== contatti[0].codice_fiscale){ //Solo il care giver non può essere eliminato con questa operazione
                    $("#labelEliminaImpegnativa").append("Sei sicuro di voler eliminare il contatto: <br>" + '<b>'+row.data().nome + ' ' +row.data().cognome);
                    $("#centralModalDanger").modal();
                    $("#btnconfermaEliminazione").click(function (e) {
                        //REST elimina contatto
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
                }
            } );
            // Visualizza la form di modifica del contatto
            $('#example tbody').on('click', 'td.edit-control', function () {
                let tr = $(this).closest('tr');
                let row = table.row( tr );
                let d = row.data();
                Modifica(d);
                $('#tableprincipale').hide();
                $('#test').show();
                $('#tableModifica').DataTable({
                    searching: false,
                    paging: false,
                    info:false
                });

            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });

});
