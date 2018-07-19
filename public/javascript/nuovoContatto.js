//Set Stepper
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
let navListItems, allWells, nextBtn, allPrevBtn, btnRegistrati;
navListItems = $('div.setup-panel-2 div a');
allWells = $('.setup-content-2');
nextBtn = $('#btnForm1');
btnRegistrati = $("#btnregistrazione");
allPrevBtn = $('.prevBtn-2');

allWells.hide();

navListItems.click(function (e) {
    e.preventDefault();
    let $target = $($(this).attr('href')),
        $item = $(this);
    navListItems.removeClass('btn-amber').addClass('btn-blue-grey');
    $item.addClass('btn-amber');
    allWells.hide();
    $target.show();
    //$target.find('input:eq(0)').focus();
});

allPrevBtn.click(function(){
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        prevStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().prev().children("a");
    prevStepSteps.removeAttr('disabled').trigger('click');
});

nextBtn.click(function(){
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        nextStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
        formParameters = curStep.find("input[type='text'],input[type='url'],input[type='password'],input[type='email'],select"),
        isValid = true;
    for(let i=0; i< formParameters.length; i++){
            if(formParameters[i].id === "formNome"){
                if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                    isValid = false;
                    $("#nomeHelp").fadeIn();
                }
                else
                    $("#nomeHelp").fadeOut();
            }
            else if(formParameters[i].id === "formCognome"){
                if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                    isValid = false;
                    $("#cognomeHelp").fadeIn();
                }
                else
                    $("#cognomeHelp").fadeOut();
            }
            else if(formParameters[i].id === "date-picker-example"){
                if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                    isValid = false;
                    $("#data-nascitaHelp").fadeIn();
                }
                else
                    $("#data-nascitaHelp").fadeOut();
            }
            else if(formParameters[i].id === "formCodFisc"){
                if(!formParameters[i].value || formParameters[i].value.trim() === '' || formParameters[i].value.length !== 16){
                    isValid = false;
                    $("#codice-fiscaleHelp").fadeIn();
                }
                else
                    $("#codice-fiscaleHelp").fadeOut();
            }
            else if(formParameters[i].id === "listacomunenascita"){
                if(!formParameters[i].value){
                    isValid = false;
                    $("#comunenascitaHelp").fadeIn();
                    if(!$('#listaprovincenascita').val())
                        $("#provincia-nascitaHelp").fadeIn();
                }
                else{
                    $("#comunenascitaHelp").fadeOut();
                    $("#provincia-nascitaHelp").fadeOut();
                }
            }
            else if(formParameters[i].id === "formSesso"){
                if(!formParameters[i].value){
                    isValid = false;
                    $("#sessoHelp").fadeIn();
                }
                else
                    $("#sessoHelp").fadeOut();
            }
            else if(formParameters[i].id === "statocivile"){
                if(!formParameters[i].value){
                    isValid = false;
                    $("#stato-civileHelp").fadeIn();
                }
                else
                    $("#stato-civileHelp").fadeOut();
            }

    }
    if (isValid){
        nextStepSteps.removeAttr('disabled').trigger('click');
    }
});

$('div.setup-panel-2 div a.btn-amber').trigger('click');
//$('#btn-step-3').trigger('click');

$(document).ready(function () {
    //gestione picker e mdb-select registrazione
    $('.datepicker').pickadate({
        monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        weekdaysFull: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        showMonthsShort: undefined,
        showWeekdaysFull: undefined,
        clear: 'Cancella',
        close: 'Chiudi',
        firstDay: 1,
        selectYears: 150,
        format: 'dd/mm/yyyy',
        formatSubmit: 'dd/mm/yyyy',
        labelMonthNext: 'Mese successivo',
        labelMonthPrev: 'Mese precedente',
        labelMonthSelect: 'Seleziona un mese',
        labelYearSelect: 'Seleziona un anno',
        max: new Date(),
        min: new  Date(1900,0,1)
    });
    $('.mdb-select').material_select();
    let selectProvinceNascita = $("#listaprovincenascita");
    $.ajax({
        type: "GET",
        url: "http://ecuptservice.ak12srl.it/comuni/listaprovince",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            $('select[name="listaprovince"]').material_select('destroy');
            for (let i = 0; i < data.length; i++) {
                selectProvinceNascita.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            $('select[name="listaprovince"]').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    $('#listaprovincenascita').on('change', function () {
        let selectComuneNascita = $("#listacomunenascita");
        let send = {codIstat: this.value};
        $.ajax({
            type: "POST",
            url: "http://ecuptservice.ak12srl.it/comuni/listacomuni",
            data: JSON.stringify(send),
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#listacomunenascita').material_select('destroy');
                $('#listacomunenascita').find('option').remove();
                selectComuneNascita.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                for (let i = 0; i < data.length; i++) {
                    selectComuneNascita.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                }
                $('#listacomunenascita').material_select();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });
    let selectStatoCivile = $("#statocivile");
    $.ajax({
        type: "GET",
        url: "http://ecuptservice.ak12srl.it/statocivile",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            for (let i = 0; i < data.length; i++) {
                selectStatoCivile.append('<option value="' + data[i].id + '">' + data[i].descrizione + '</option>');
            }
            $('#statocivile').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    let selectProvinceResidenza = $("#listaprovinceresidenza");
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
});

//manage stepper buttons
$('#btn-step-1').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if(stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    stepper.addClass('step-1');
});
$('#btn-step-2').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    if(stepper.hasClass('step-3'))
        stepper.removeClass('step-3');
    stepper.addClass('step-2');
});
$('#btn-step-3').click(function () {
    let stepper = $('.steps-form-2 .steps-row-2');
    if(stepper.hasClass('step-2'))
        stepper.removeClass('step-2');
    if(stepper.hasClass('step-1'))
        stepper.removeClass('step-1');
    stepper.addClass('step-3');
});

btnRegistrati.click(function() {
    //Controllo campi form 2
    let curForm = $(this).closest(".setup-content-2");
    let formParameters = curForm.find("input[type='text'],input[type='url'],input[type='password'],input[type='email'],input[type='checkbox'],select");
    let isValid = true;
    for(let i=0;i<formParameters.length;i++){
         if(formParameters[i].id === "listacomuneresidenza"){
            if(!formParameters[i].value){
                isValid = false;
                $("#comune-residenzaHelp").fadeIn();
                if(!$("#listaprovinceresidenza").val())
                    $("#provincia-residenzaHelp").fadeIn();
            }
            else{
                $("#comune-residenzaHelp").fadeOut();
                $("#provincia-residenzaHelp").fadeOut();
            }
        }
        else if(formParameters[i].id === "formIndirizzo"){
            if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#indirizzoHelp").fadeIn();
            }
            else
                $("#indirizzoHelp").fadeOut();
        }
        else if(formParameters[i].id === "formTelefono"){
            if(!formParameters[i].validity.valid || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#telefonoHelp").fadeIn();
            }
            else
                $("#telefonoHelp").fadeOut();
        }
        //Controllo Email
        else if(formParameters[i].id === 'formEmail') {
             if(!formParameters[i].validity.valid){
                 isValid = false;
                 $("#emailHelp").fadeIn();
             }else
                 $("#emailHelp").fadeOut();
         }
    }
    if(isValid){
        //dati anagrafici
        let nome = $('#formNome').val().toUpperCase();
        let cognome = $('#formCognome').val().toUpperCase();
        let codicefiscale = $('#formCodFisc').val().toUpperCase();
        let datanascita = $('#date-picker-example').val().toUpperCase();
        let provincianascita = $('#listaprovincenascita').val().toUpperCase();
        let codicecomunenascita = $('#listacomunenascita').val().toUpperCase();
        let comunenascita = $("#listacomunenascita").find("option[value='" + codicecomunenascita + "']").text().toUpperCase();
        let sesso = $('#formSesso').val().toUpperCase();
        let codicestatocivile = $('#statocivile').val().toUpperCase();
        let statocivile = $("#statocivile").find("option[value='" + codicestatocivile + "']").text().toUpperCase();
        //dati personali
        let email = $('#formEmail').val();
        let telefono = $('#formTelefono').val().toUpperCase();
        let codiceprovinciaresidenza = $("#listaprovinceresidenza").val().toUpperCase();
        let provinciaresidenza = $("#listaprovinceresidenza").find("option[value='" + codiceprovinciaresidenza + "']").text().toUpperCase();
        let codicecomuneresidenza = $('#listacomuneresidenza').val().toUpperCase();
        let comuneresidenza = $("#listacomuneresidenza").find("option[value='" + codicecomuneresidenza + "']").text().toUpperCase();
        let indirizzo = $('#formIndirizzo').val().toUpperCase();

        let assistito = {
            email: email,
            nome: nome,
            cognome: cognome,
            sesso: sesso,
            codice_fiscale: codicefiscale,
            telefono: telefono,
            codStatoCivile: codicestatocivile,
            data_nascita: datanascita,
            luogo_nascita: comunenascita,
            istatComuneNascita: codicecomunenascita,
            provincia: provinciaresidenza,
            comune_residenza: comuneresidenza,
            indirizzores: indirizzo,
            istatComuneResidenza: codicecomuneresidenza,
            statocivile: statocivile
        };
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: JSON.stringify(assistito),
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                if(jqXHR.status === 201) {
                    $('#btn-step-3').removeAttr('disabled').trigger('click');
                    setTimeout(function () {
                        //DA CONTROLLARE !!!!!
                        window.location.href = '/:azienda/rubrica';
                    }, 2000);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#paragrafomodalError').text(jqXHR.responseText);
                $('#centralModalError').modal('show');
            }
        });
    }
});