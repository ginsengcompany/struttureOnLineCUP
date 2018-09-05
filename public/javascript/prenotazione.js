$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
$("#rowCodiceImpegnativa1").hide();
$("#rowCodiceImpegnativa2").hide();
$("#rowAutoFill").hide();
$("#rowBottoneInvio").hide();
$('#barra').hide();
$('#example2').hide();
$('#data').hide();
let navListItems, allWells, nextPrenotazione, nextVerificaContenuto, allPrevBtn, btnConfermaPrenotazione,
    datiDisponibilita, table2, emailSelezionato;
navListItems = $('div.setup-panel-2 div a');
allWells = $('.setup-content-2');
nextPrenotazione = $('#invioPrenotazione');
nextVerificaContenuto = $("#continuaPrenotazione");
allWells.hide();
let prestazioniVerifica = {erogabili:[],non_erogabili:[]}, prestReparti, datiPrenotazione, assistito;
navListItems.click( async function (e) {
    e.preventDefault();
    let $target = $($(this).attr('href')),
        $item = $(this);
    navListItems.removeClass('btn-amber').addClass('btn-blue-grey');
    $item.addClass('btn-amber');
    allWells.hide();
    $target.show();
    if ($target[0].id === "step-2") {
        $('#nome').val(assistito.nome);
        $('#cognome').val(assistito.cognome);
        $('#codFisc').val(assistito.codice_fiscale);
        for (let i = 0; i < datiPrenotazione.prestazioni.length; i++)
            await verificaPrestazioni(datiPrenotazione.prestazioni[i]);
        let prestazioni = [];
        let rowTable = "";
        let caricato = 0;
        if(prestazioniVerifica.non_erogabili.length > 0 && prestazioniVerifica.erogabili.length === 0) {
            $("#paragrafomodalPrenotazione").text("La struttura ospedaliera non eroga le prestazioni richieste.");
            $("#centralModalAlert").modal("show");
            setTimeout(function () {
                window.location.href = 'home';
            }, 2000);
            return;
        }
        else if (prestazioniVerifica.non_erogabili.length > 0){
            let messaggio = "La struttura non eroga le seguenti prestazioni: ";
            for(let j=0;j<prestazioniVerifica.non_erogabili.length;j++){
                messaggio += prestazioniVerifica.non_erogabili[j].desprest;
                if(j !== (prestazioniVerifica.non_erogabili.length - 1))
                    messaggio += ", ";
            }
            $("#paragrafomodalPrenotazione").text(messaggio);
            $("#centralModalAlert").modal("show");
        }
        for (let i = 0; i < prestazioniVerifica.erogabili.length; i++) {
            $.ajax({
                type: "POST",
                data: JSON.stringify(prestazioniVerifica.erogabili[i]),
                url: window.location.href + "/prelevaReparti",
                dataType: "json",
                contentType: 'application/json',
                success: function (data2, textStatus2, jqXHR2) {
                    prestazioni.push({
                        prestazione: prestazioniVerifica.erogabili[i],
                        reparti: data2
                    });
                    prestReparti = prestazioni;
                    rowTable += "<tr>" + "<td>" + prestazioniVerifica.erogabili[i].desprest + "</td><td>" +
                        "<select id='selectPrestazione" + i +
                        "' class='mdb-select'><option value='0' selected>" + data2[0].descrizione +
                        "</option>";
                    for (let k = 1; k < data2.length; k++) {
                        rowTable += "<option value='" + k +
                            "'>" + data2[k].descrizione + "</option>";
                    }
                    rowTable += "</select></td></tr>";
                    caricato++;
                    if (caricato === prestazioniVerifica.erogabili.length) {
                        $("#bodyDataTable").append(rowTable);
                        let table = $('#example').DataTable({
                            language: {
                                url: '../localisation/it-IT.json'
                            },
                            retrieve: true,
                            paging: false
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
    else if ($target[0].id === "step-3") {
        let prest = prestReparti;
        for (let i = 0; i < prest.length; i++) {
            let index = $("#selectPrestazione" + i + " option:selected").val();
            prest[i].reparti[index].repartoScelto = true;
        }
        $('#barra').show();
        $('#btnProssimaDisp').hide();
        $('#btnRicercaData').hide();
        $('#btnConfermaPreno').hide();
        $("#btnAnnullaStep3").hide();
        $.ajax({
            type: "POST",
            data: JSON.stringify(prest),
            url: window.location.href + "/primaDisponibilita",
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                datiDisponibilita = data;
                $('#barra').hide();
                $('#example2').show();
                $('#btnProssimaDisp').show();
                $('#btnRicercaData').show();
                $('#btnConfermaPreno').show();
                $("#btnAnnullaStep3").show();
                table2 = $('#example2').DataTable({
                    responsive: true,
                    language: {
                        url: '../localisation/it-IT.json'
                    },
                    data: data.appuntamenti,
                    columns: [
                        {
                            data: "desprest",
                        },
                        {
                            data: "reparti[0].descrizione",
                        },
                        {
                            data: "reparti[0].desunitaop",
                        },
                        {
                            data: "dataAppuntamento",
                        },
                        {
                            data: "oraAppuntamento",
                        },
                        {
                            data: "reparti[0].nomeMedico",
                        },
                        {
                            data: "reparti[0].ubicazioneReparto",
                        },
                    ],
                    columnDefs: [
                        {
                            targets: '_all',
                            defaultContent: 'Non Disponibile',
                            "render": function (data) {
                                if (data === "")
                                    return 'Non Disponibile';
                                else {
                                    return data
                                }
                            }
                        }
                    ]
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#barra').hide();
            }
        });
    }
});
$('#btnProssimaDisp').click( async function () {
    $('#barra').show();
    $('#example2').parents('div.dataTables_wrapper').first().hide();
    $('#example2').hide();
    $('#btnProssimaDisp').hide();
    $('#btnRicercaData').hide();
    $('#btnConfermaPreno').hide();
    $("#btnAnnullaStep3").hide();
    let stato,i=0;
    do {
        stato = await retryDispOrario();
        i++;
    } while(i<5 && !stato);
    if (!stato){
        $('#barra').hide();
        $('#example2').parents('div.dataTables_wrapper').first().show();
        $('#example2').show();
        $('#btnProssimaDisp').show();
        $('#btnRicercaData').show();
        $('#btnConfermaPreno').show();
        $("#btnAnnullaStep3").show();
    }
});

function retryDispOrario() {
    return new Promise( f => {
        $.ajax({
            type: "POST",
            data: JSON.stringify(datiDisponibilita),
            url: window.location.href + "/prossimaDisponibilita",
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#barra').hide();
                $('#example2').parents('div.dataTables_wrapper').first().show();
                $('#example2').show();
                $('#btnProssimaDisp').show();
                $('#btnRicercaData').show();
                $('#btnConfermaPreno').show();
                $("#btnAnnullaStep3").show();
                datiDisponibilita = data;
                table2.destroy();
                table2 = $('#example2').DataTable({
                    responsive: true,
                    language: {
                        url: '../localisation/it-IT.json'
                    },
                    data: datiDisponibilita.appuntamenti,
                    columns: [
                        {
                            data: "desprest",
                        },
                        {
                            data: "reparti[0].descrizione",
                        },
                        {
                            data: "reparti[0].desunitaop",
                        },
                        {
                            data: "dataAppuntamento",
                        },
                        {
                            data: "oraAppuntamento",
                        },
                        {
                            data: "reparti[0].nomeMedico",
                        },
                        {
                            data: "reparti[0].ubicazioneReparto",
                        },
                    ],
                    columnDefs: [
                        {
                            targets: '_all',
                            defaultContent: 'Non Disponibile',
                            "render": function (data) {
                                if (data === "")
                                    return 'Non Disponibile';
                                else {
                                    return data
                                }
                            }
                        }
                    ]
                });
                f(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status === 449)
                    f(false);
                $('#barra').hide();
                f(false);
            }
        });
    });
}

$('#btnRicercaData').click(function (event) {
    //let picker = input.pickadate('picker');
    event.stopPropagation();
    event.preventDefault();
    //picker.open();
    $('#data').trigger('click');
});

$("#data").on('change', function () {
    let dataValue = $(this).val();
    if (dataValue !== '') {
        $('#btnProssimaDisp').hide();
        $('#btnRicercaData').hide();
        $('#btnConfermaPreno').hide();
        $("#btnAnnullaStep3").hide();
        $('#example2').hide();
        $('#example2').parents('div.dataTables_wrapper').first().hide();
        $('#barra').show();
        $.ajax({
            type: "POST",
            data: JSON.stringify(datiDisponibilita),
            headers: {'dataricerca': dataValue},
            url: window.location.href + "/ricercaData",
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#barra').hide();
                $('#example2').parents('div.dataTables_wrapper').first().show();
                $('#example2').show();
                $('#btnProssimaDisp').show();
                $('#btnRicercaData').show();
                $('#btnConfermaPreno').show();
                $("#btnAnnullaStep3").show();
                datiDisponibilita = data;
                table2.destroy();
                table2 = $('#example2').DataTable({
                    responsive: true,
                    language: {
                        url: '../localisation/it-IT.json'
                    },
                    data: datiDisponibilita.appuntamenti,
                    columns: [
                        {
                            data: "desprest",
                        },
                        {
                            data: "reparti[0].descrizione",
                        },
                        {
                            data: "reparti[0].desunitaop",
                        },
                        {
                            data: "dataAppuntamento",
                        },
                        {
                            data: "oraAppuntamento",
                        },
                        {
                            data: "reparti[0].nomeMedico",
                        },
                        {
                            data: "reparti[0].ubicazioneReparto",
                        },
                    ],
                    columnDefs: [
                        {
                            targets: '_all',
                            defaultContent: 'Non Disponibile',
                            "render": function (data) {
                                if (data === "")
                                    return 'Non Disponibile';
                                else {
                                    return data
                                }
                            }
                        }
                    ]
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#barra').hide();
            }
        });
    }
});

$('#btnConfermaPreno').click(function () {
    $('#btnProssimaDisp').hide();
    $('#btnRicercaData').hide();
    $('#btnConfermaPreno').hide();
    $("#btnAnnullaStep3").hide();
    $('#example2').hide();
    $('#example2').parents('div.dataTables_wrapper').first().hide();
    $('#barra').show();
    let datiConferma = {
        assistito: assistito,
        appuntamenti: datiDisponibilita.appuntamenti,
        dataEmissioneRicetta: datiPrenotazione.dataEmissioneRicetta,
        codiceImpegnativa: datiPrenotazione.nre,
        classePriorita: datiPrenotazione.classePriorita,
        termid: datiDisponibilita.termid
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(datiConferma),
        url: window.location.href + "/confermaPrenotazione",
        dataType: "json",
        contentType: 'application/json',
        success: function (data, textStatus, jqXHR) {
            let response = data;
            $('#btnProssimaDisp').hide();
            $('#btnRicercaData').hide();
            $('#btnConfermaPreno').hide();
            $("#btnAnnullaStep3").hide();
            $('#example2').hide();
            $('#example2').parents('div.dataTables_wrapper').first().hide();
            $('#barra').hide();
            $('#paragraphUltimoStep').addClass("green-text");
            $('#paragraphUltimoStep').text(response.messaggio);
            $('#btn-step-4').removeAttr('disabled').trigger('click');
            setTimeout(function () {
                window.location.href = 'home';
            }, 2000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 502)
            {
                let i=0, stato;
                do {
                    stato = retryConfermaPrenotazione();
                    i++;
                } while(i<3 && stato !== 409);
                if (stato === 409){ //prenotazione completata
                    $('#btnProssimaDisp').hide();
                    $('#btnRicercaData').hide();
                    $('#btnConfermaPreno').hide();
                    $("#btnAnnullaStep3").hide();
                    $('#example2').hide();
                    $('#example2').parents('div.dataTables_wrapper').first().hide();
                    $('#barra').hide();
                    $('#paragraphUltimoStep').addClass("green-text");
                    $('#paragraphUltimoStep').text("Prenotazione Completata!");
                    $('#btn-step-4').removeAttr('disabled').trigger('click');
                    setTimeout(function () {
                        window.location.href = 'home';
                    }, 2000);
                }
                else {
                    $('#btnProssimaDisp').hide();
                    $('#btnRicercaData').hide();
                    $('#btnConfermaPreno').hide();
                    $("#btnAnnullaStep3").hide();
                    $('#example2').hide();
                    $('#example2').parents('div.dataTables_wrapper').first().hide();
                    $('#barra').hide();
                    $('#paragraphUltimoStep').text("Prenotazione non riuscita!");
                    $('#paragraphUltimoStep').addClass("red-text");
                    $('#btn-step-4').removeAttr('disabled').trigger('click');
                    setTimeout(function () {
                        window.location.href = 'home';
                    }, 2000);
                }
            }
            else {
                $('#btnProssimaDisp').hide();
                $('#btnRicercaData').hide();
                $('#btnConfermaPreno').hide();
                $("#btnAnnullaStep3").hide();
                $('#example2').hide();
                $('#example2').parents('div.dataTables_wrapper').first().hide();
                $('#barra').hide();
                $('#paragraphUltimoStep').text(jqXHR.responseText);
                $('#paragraphUltimoStep').addClass("red-text");
                $('#btn-step-4').removeAttr('disabled').trigger('click');
                setTimeout(function () {
                    window.location.href = 'home';
                }, 2000);
            }
        }
    });
});

function retryConfermaPrenotazione() {
        $.ajax({
            type: "POST",
            data: JSON.stringify(datiConferma),
            url: window.location.href + "/datiImpegnativa",
            dataType: "json",
            contentType: 'application/json',
            async: false,
            success: function (data, textStatus, jqXHR) {
                return jqXHR.status;
            },
            error: function (jqXHR, textStatus, errorThrown){
                return jqXHR.status;
            }
        });
}

$('#btnTerminaPrenotazione').click(function () {

});

/*$("#codiceImpegnativa1").on("keypress", function (e) {
    if(e.keyCode === 13 && ($("#codiceImpegnativa1").val().length === 15) || ($("#codiceImpegnativa1").val().length + $("#codiceImpegnativa2").val().length === 15)) { //tasto ENTER
        e.preventDefault();
        $("#invioPrenotazione").trigger('click');
    }
});

$("#codiceImpegnativa2").on("keypress", function (e) {
    if(e.keyCode === 13 && ($("#codiceImpegnativa1").val().length === 15) || ($("#codiceImpegnativa1").val().length + $("#codiceImpegnativa2").val().length === 15)) { //tasto ENTER
        e.preventDefault();
        $("#invioPrenotazione").trigger('click');
    }
});*/

nextVerificaContenuto.click(function () {
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        nextStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().next().children("a");

    nextStepSteps.removeAttr('disabled').trigger('click');
});
nextPrenotazione.click(function () {
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        nextStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().next().children("a");
    let sendObject = {
        nre: $('#codiceImpegnativa1').val() + $('#codiceImpegnativa2').val(),
        assistito: {
            codice_fiscale: $("#codiceFiscaleAutofill").val(),
            nome: $("#nomeAutofill").val(),
            cognome: $("#cognomeAutofill").val()
        }
    };
    $('#barra').show();
    $("#invioPrenotazione").prop("disabled", true);
    $.ajax({
        type: "POST",
        url: window.location.href + "/datiImpegnativa",
        data: JSON.stringify(sendObject),
        dataType: "json",
        contentType: 'application/json',
        success: function (data, textStatus, jqXHR) {
            datiPrenotazione = data;
            assistito = sendObject.assistito;
            $('#barra').hide();
            nextStepSteps.removeAttr('disabled').trigger('click');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
            $('#centralModalAlert').modal('show');
            $("#invioPrenotazione").prop("disabled", false);
            $('#barra').hide();
        }
    });
});
$('div.setup-panel-2 div a.btn-amber').trigger('click');

$(document).ready(function () {
    $('#nomeAutofill').val('');
    $('#cognomeAutofill').val('');
    $('#codiceFiscaleAutofill').val('');
    $('#codiceImpegnativa1').val('');
    $('#codiceImpegnativa2').val('');
    $('.mdb-select').material_select();
    let selectNome = $("#selectNominativo");
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
            data.sort(function (a, b) {
                return (a.nomeCompletoConCodiceFiscale > b.nomeCompletoConCodiceFiscale) ? 1 : ((b.nomeCompletoConCodiceFiscale > a.nomeCompletoConCodiceFiscale) ? -1 : 0);
            });
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona" + '</option>');
            for (let i = 0; i < data.length; i++) {
                selectNome.append('<option value="' + i + '">' + data[i].nomeCompletoConCodiceFiscale + '</option>');
            }
            $('.mdb-select').material_select();
            $('#selectNominativo').on('change', function () {
                $("#rowAutoFill").show();
                let nomeSelezionato = $("#selectNominativo option:selected").val();
                emailSelezionato = data[nomeSelezionato].email;
                $("#rowCodiceImpegnativa1").show();
                $("#rowAutoFill").show();
                $("#nomeAutofill").val(data[nomeSelezionato].nome);
                $("#cognomeAutofill").val(data[nomeSelezionato].cognome);
                $("#codiceFiscaleAutofill").val(data[nomeSelezionato].codice_fiscale);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
            $('#centralModalAlert').modal('show');
        }
    });
    $('#codiceImpegnativa1').on('input', function () {
        $('input[type=text]').val(function () {
            return this.value.toUpperCase();
        });
        $('#codiceImpegnativa2').val("");
        if ($('#codiceImpegnativa1').val().length > 5 && $('#codiceImpegnativa1').val().length === 15) {
            $('#labelcodiceImpegnativa1').text("Inserisci il codice SAR");
            $("#rowCodiceImpegnativa2").hide();


            $("#rowBottoneInvio").show();
        }
        else if ($('#codiceImpegnativa1').val().length === 5) {
            $("#rowCodiceImpegnativa2").show();
        }
        else {
            $('#labelcodiceImpegnativa1').text("Inserisci il codice Impegnativa");
            $("#rowCodiceImpegnativa2").hide();
            $("#rowBottoneInvio").hide();
        }
    });
    $('#codiceImpegnativa2').on('input', function () {
        $('#codiceImpegnativa2').attr({
            "max": 15
        });
        $('input[type=text]').val(function () {
            return this.value.toUpperCase();
        });
        if ($('#codiceImpegnativa2').val() === '' || $('#codiceImpegnativa2').val().length < 10)
            $("#rowBottoneInvio").hide();
        else
            $("#rowBottoneInvio").show();
    });
    $('#data').pickadate({
        monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        weekdaysFull: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        showMonthsShort: undefined,
        showWeekdaysFull: undefined,
        clear: 'Cancella',
        close: 'Chiudi',
        closeOnSelect: true,
        closeOnClear: false,
        firstDay: 1,
        selectYears: 150,
        format: 'dd/mm/yyyy',
        formatSubmit: 'dd/mm/yyyy',
        labelMonthNext: 'Mese successivo',
        labelMonthPrev: 'Mese precedente',
        labelMonthSelect: 'Seleziona un mese',
        labelYearSelect: 'Seleziona un anno',
        min: new Date()
    });
});

$(".annulla-presaincarico").click(function () {
    $('.enableButtons').prop('disabled', true);
    $("#barra").show();
    $.ajax({
        type: "GET",
        url: window.location.href + "/annullaprenotazionesospesa",
        success: function (data, textStatus, jqXHR) {
            $("#barra").hide();
            $("#paragrafomodalPrenotazione").text(data);
            $('#centralModalAlert').modal('show');
            window.location.href = "home";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#barra").hide();
            if (jqXHR.status !== 404 && jqXHR.status !== 502){
                $("#paragrafomodalPrenotazione").text("La richiesta è stata presa in carico. L'impegnativa verrà resa disponibile il prima possibile");
                $('#centralModalAlert').modal('show');
            }
            else{
                $("#paragrafomodalPrenotazione").text("L'impegnativa è ora disponibile");
                $('#centralModalAlert').modal('show');
            }
            setTimeout(function () {
                $('.enableButtons').prop('disabled', false);
                window.location.href = "home";
            },2000);
        }
    });
});

//manage stepper buttons
$('#btn-step-1').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if (stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if (stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    if (stepper.hasClass('step-4'))
        stepper.removeClass('step-4');
    stepper.addClass('step-1');
});
$('#btn-step-2').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if (stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if (stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    if (stepper.hasClass('step-4'))
        stepper.removeClass('step-4');
    stepper.addClass('step-2');
});
$('#btn-step-3').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if (stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if (stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if (stepper.hasClass('step-4'))
        stepper.removeClass('step-4');
    stepper.addClass('step-3');
});
$('#btn-step-4').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if (stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if (stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if (stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    stepper.addClass('step-4');
});

function verificaPrestazioni(datiPren) {
    return new Promise( f => {
        $.ajax({
            type: "POST",
            data: JSON.stringify(datiPren),
            url: window.location.href + "/prestazioniErogabili",
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                if(data.prestazioni_non_erogabili.length > 0)
                    prestazioniVerifica.non_erogabili.push(data.prestazioni_non_erogabili[0]);
                else
                    prestazioniVerifica.erogabili.push(data.prestazioni_erogabili[0]);
                f(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
                $('#centralModalAlert').modal('show');
                f(false);
            }
        });
    });
}