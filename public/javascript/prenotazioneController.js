$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
$( "#rowCodiceImpegnativa1" ).hide();
$( "#rowCodiceImpegnativa2" ).hide();
$( "#rowAutoFill" ).hide();
$( "#rowBottoneInvio" ).hide();
$('#barra').hide();
let navListItems, allWells, nextPrenotazione, nextVerificaContenuto, allPrevBtn, btnConfermaPrenotazione;
navListItems = $('div.setup-panel-2 div a');
allWells = $('.setup-content-2');
nextPrenotazione = $('#invioPrenotazione');
allWells.hide();
navListItems.click(function (e) {
    e.preventDefault();
    let $target = $($(this).attr('href')),
        $item = $(this);
    navListItems.removeClass('btn-amber').addClass('btn-blue-grey');
    $item.addClass('btn-amber');
    allWells.hide();
    $target.show();
    if($target[0].id === "step-2"){
        datiPrenotazione = sessionStorage.getItem('datiPrenotazione');
        datiPrenotazione = JSON.parse(datiPrenotazione);
        assistito = sessionStorage.getItem('assistito');
        assistito = JSON.parse(assistito);
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
                    let rowTable = "";
                    let caricato = 0;
                    for (let i=0;i<data.prestazioni_erogabili.length;i++)
                    {
                        $.ajax({
                            type: "POST",
                            data: JSON.stringify(data.prestazioni_erogabili[i]),
                            url: window.location.href + "/prelevaReparti",
                            dataType: "json",
                            contentType: 'application/json',
                            success: function (data2, textStatus2, jqXHR2) {
                                prestazioni.push({
                                    prestazione: data.prestazioni_erogabili[i],
                                    reparti: data2
                                });
                                rowTable += "<tr>" + "<td>"+ data.prestazioni_erogabili[i].desprest + "</td><td>" +
                                    "<select id='selectPrestazione" + i +
                                    "' class='mdb-select'><option value='0' selected>" + data2[0].descrizione +
                                    "</option>";
                                for (let k=1; k < data2.length; k++){
                                    rowTable += "<option value='" + k +
                                        "'>" + data2[k].descrizione +"</option>";
                                }
                                rowTable += "</select></td></tr>";
                                caricato++;
                                if (caricato === data.prestazioni_erogabili.length){
                                    $("#bodyDataTable").append(rowTable);
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
        $('#nome').val(assistito.nome);
        $('#cognome').val(assistito.cognome);
        $('#codFisc').val(assistito.codice_fiscale);
    }
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
    $("#invioPrenotazione" ).prop( "disabled", true );
    $.ajax({
        type: "POST",
        url: window.location.href + "/datiImpegnativa",
        data: JSON.stringify(sendObject),
        dataType: "json",
        contentType: 'application/json',
        success: function (data, textStatus, jqXHR) {
            sessionStorage.setItem("datiPrenotazione", JSON.stringify(data));
            sessionStorage.setItem("assistito", JSON.stringify(sendObject.assistito));
            $('#barra').hide();
            nextStepSteps.removeAttr('disabled').trigger('click');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
            $('#centralModalAlert').modal('show');
            $("#invioPrenotazione" ).prop( "disabled", false );
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
    $(".button-collapse").sideNav();
    $('.mdb-select').material_select();
    let selectNome = $("#selectNominativo");
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
            data.sort(function(a,b) {
                return (a.nomeCompletoConCodiceFiscale > b.nomeCompletoConCodiceFiscale) ? 1 : ((b.nomeCompletoConCodiceFiscale > a.nomeCompletoConCodiceFiscale) ? -1 : 0);
            });
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona" + '</option>');
            for (let i = 0; i < data.length; i++) {
                selectNome.append('<option value="' + i + '">' + data[i].nomeCompletoConCodiceFiscale + '</option>');
            }
            $('.mdb-select').material_select();
            $('#selectNominativo').on('change', function () {
                $( "#rowAutoFill" ).show();
                let nomeSelezionato = $( "#selectNominativo option:selected" ).val();
                $( "#rowCodiceImpegnativa1" ).show();
                $( "#rowAutoFill" ).show();
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
    $('#codiceImpegnativa1').on('input',function (){
        $('input[type=text]').val (function () {
            return this.value.toUpperCase();
        });
        $('#codiceImpegnativa2').val("");
        if($('#codiceImpegnativa1').val().length > 5 && $('#codiceImpegnativa1').val().length === 15) {
            $('#labelcodiceImpegnativa1').text("Inserisci il codice SAR");
            $("#rowCodiceImpegnativa2").hide();


            $( "#rowBottoneInvio" ).show();
        }
        else if($('#codiceImpegnativa1').val().length === 5) {
            $("#rowCodiceImpegnativa2").show();
        }
        else {
            $('#labelcodiceImpegnativa1').text("Inserisci il codice Impegnativa");
            $("#rowCodiceImpegnativa2").hide();
            $("#rowBottoneInvio").hide();
        }
    });
    $('#codiceImpegnativa2').on('input',function (){
        $('#codiceImpegnativa2').attr({
            "max" : 15
        });
        $('input[type=text]').val (function () {
            return this.value.toUpperCase();
        });
        if($('#codiceImpegnativa2').val() === '' || $('#codiceImpegnativa2').val().length < 10)
            $("#rowBottoneInvio").hide();
        else
            $("#rowBottoneInvio").show();
    });
});

//manage stepper buttons
$('#btn-step-1').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if(stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    if(stepper.hasClass('step-4'))
        stepper.removeClass('step-4');
    stepper.addClass('step-1');
});
$('#btn-step-2').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if(stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    if(stepper.hasClass('step-4'))
        stepper.removeClass('step-4');
    stepper.addClass('step-2');
});
$('#btn-step-3').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if(stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if(stepper.hasClass('step-4'))
        stepper.removeClass('step-4');
    stepper.addClass('step-3');
});
$('#btn-step-4').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if(stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if(stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    stepper.addClass('step-4');
});
