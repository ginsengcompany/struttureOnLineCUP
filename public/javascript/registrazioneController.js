//Set Stepper
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
let navListItems, allWells, allNextBtn, allPrevBtn;
navListItems = $('div.setup-panel-2 div a');
allWells = $('.setup-content-2');
nextBtn = $('#btnForm1');
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
        curInputs = curStep.find("input[type='text'],input[type='url'],input[type='password'],input[type='email']"),
        isValid = true;
    for(let i=0; i< curInputs.length; i++){
        //Controllo Username
        if(curInputs[i].id === 'formUsername') {
            if(!curInputs[i].validity.valid || curInputs[i].value.trim() === ''){
                isValid = false;
                $("#usernameHelp").show();
            }else
                $("#usernameHelp").hide();
        }
        //Controllo Password
        else if(curInputs[i].id === 'formPassword') {
            if(!curInputs[i].validity.valid){
                isValid = false;
                $("#passwordHelpBlockMD").addClass('red-text');
            }
            else
                $("#passwordHelpBlockMD").removeClass('red-text');
        }
        //Controllo Conferma Password
        else if(curInputs[i].id === 'formConfermaPassword'){
            if(!curInputs[i].validity.valid) {
                isValid = false;
                $("#confermaPasswordHelp").text("formato della password è errata");
                $("#confermaPasswordHelp").show();
            }
            else if (curInputs[i].value !== $("#formPassword").val()) {
                isValid = false;
                $("#confermaPasswordHelp").text("Le password non corrispondono");
                $("#confermaPasswordHelp").show();
            }else
                $("#confermaPasswordHelp").hide();
        }
        //Controllo Email
        else if(curInputs[i].id === 'formEmail') {
            if(!curInputs[i].validity.valid){
                isValid = false;
                $("#emailHelp").show();
            }else
                $("#emailHelp").hide();
        }
        //Controllo Conferma Email
        else if(curInputs[i].id === 'formConfermaEmail'){
            if(!curInputs[i].validity.valid){
                isValid = false;
                $("#confermaEmailHelp").text("formato dell'email è errata");
                $("#confermaEmailHelp").show();
            }
            else if(curInputs[i].value !== $("#formEmail").val()){
                isValid = false;
                $("#confermaEmailHelp").text("Le email non corrispondono");
                $("#confermaEmailHelp").show();
            }
            else
                $("#confermaEmailHelp").hide();
        }
    }
    if (isValid){
        nextStepSteps.removeAttr('disabled').trigger('click');
    }
});

$('div.setup-panel-2 div a.btn-amber').trigger('click');

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

function eseguiregistrazione(){
    let username = $('#formUsername').val();
    let password = $('#formPassword').val();
    let password2 = $('#formConfermaPassword').val();
    let email = $('#formEmail').val();
    let email2 = $('#formConfermaEmail').val();
    let nome = $('#formNome').val();
    let cognome = $('#formCognome').val();
    let sesso = $('#formSesso').val();
    let codicefiscale = $('#formCodFisc').val();
    let telefono = $('#formTelefono').val();
    let codicestatocivile = $('#statocivile').val();
    let datanascita = $('#date-picker-example').val();
    let provincianascita = $('#listaprovincenascita').val();
    let codicecomunenascita = $('#listacomunenascita').val();
    let comunenascita = $("#listacomunenascita").find("option[value='" + codicecomunenascita + "']").text();
    let codiceprovinciaresidenza = $("#listaprovinceresidenza").val();
    let provinciaresidenza = $("#listaprovinceresidenza").find("option[value='" + codiceprovinciaresidenza + "']").text();
    let codicecomuneresidenza = $('#listacomuneresidenza').val();
    let indirizzo = $('#formIndirizzo').val();
    let comuneresidenza = $("#listacomuneresidenza").find("option[value='" + codicecomuneresidenza + "']").text();
    let statocivile = $("#statocivile").find("option[value='" + codicestatocivile + "']").text();

    let sendObject = {
        username: username,
        password: password,
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
        url: "http://ecuptservice.ak12srl.it/auth/registrazione",
        data: JSON.stringify(sendObject),
        dataType: "json",
        contentType: 'application/json',
        success: function (data, textStatus, jqXHR) {
            if(jqXHR.status === 201) {
                $('#btn-step-3').removeAttr('disabled').trigger('click');
                setTimeout(function () {
                    window.location.href = '/';
                }, 2000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalError').text(jqXHR.responseText);
            $('#centralModalError').modal('show');
        }
    });
}

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

$("#registrazioneform2").submit(function() {
    eseguiregistrazione();
    return false;
    //console.log(sendObject);
});