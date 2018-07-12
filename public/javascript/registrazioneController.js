$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
$(document).ready(function () {
    $('.datepicker').pickadate({
        monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        weekdaysFull: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        showMonthsShort: undefined,
        showWeekdaysFull: undefined,
        today: 'Oggi',
        clear: 'Cancella',
        close: 'Chiudi',
        firstDay: 1,
        format: 'dd/mm/yyyy',
        formatSubmit: 'dd/mm/yyyy',
        labelMonthNext: 'Mese successivo',
        labelMonthPrev: 'Mese precedente',
        labelMonthSelect: 'Seleziona un mese',
        labelYearSelect: 'Seleziona un anno'
    });
    $('.mdb-select').material_select();
    var selectProvinceNascita = $("#listaprovincenascita");
    $.ajax({
        type: "GET",
        url: "http://192.168.125.24:3001/comuni/listaprovince",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            $('select[name="listaprovince"]').material_select('destroy');
            for (var i = 0; i < data.length; i++) {
                selectProvinceNascita.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            $('select[name="listaprovince"]').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    $('#listaprovincenascita').on('change', function () {
        var selectComuneNascita = $("#listacomunenascita");
        var send = {codIstat: this.value};
        $.ajax({
            type: "POST",
            url: "http://192.168.125.24:3001/comuni/listacomuni",
            data: JSON.stringify(send),
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#listacomunenascita').material_select('destroy');
                $('#listacomunenascita').find('option').remove();
                selectComuneNascita.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                for (var i = 0; i < data.length; i++) {
                    selectComuneNascita.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                }
                $('#listacomunenascita').material_select();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });
    var selectStatoCivile = $("#statocivile");
    $.ajax({
        type: "GET",
        url: "http://192.168.125.24:3001/statocivile",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++) {
                selectStatoCivile.append('<option value="' + data[i].id + '">' + data[i].descrizione + '</option>');
            }
            $('#statocivile').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    var selectProvinceResidenza = $("#listaprovinceresidenza");
    $.ajax({
        type: "GET",
        url: "http://192.168.125.24:3001/comuni/listaprovince",
        dataType: "json",
        contentType: 'plain/text',
        success: function (data, textStatus, jqXHR) {
            $('select[name="listaprovince"]').material_select('destroy');
            for (var i = 0; i < data.length; i++) {
                selectProvinceResidenza.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            $('select[name="listaprovince"]').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    $('#listaprovinceresidenza').on('change', function () {
        var selectComuneResidenza = $("#listacomuneresidenza");
        var send = {codIstat: this.value};
        $.ajax({
            type: "POST",
            url: "http://192.168.125.24:3001/comuni/listacomuni",
            data: JSON.stringify(send),
            dataType: "json",
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#listacomuneresidenza').material_select('destroy');
                $('#listacomuneresidenza').find('option').remove();
                selectComuneResidenza.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                for (var i = 0; i < data.length; i++) {
                    selectComuneResidenza.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                }
                $('#listacomuneresidenza').material_select();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });
    $("#registrazioneform").submit(function() {
        eseguiregistrazione();
        return false;
        //console.log(sendObject);
    });

    var navListItems = $('div.setup-panel-2 div a'),
        allWells = $('.setup-content-2'),
        allNextBtn = $('.nextBtn-2'),
        allPrevBtn = $('.prevBtn-2');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-amber').addClass('btn-blue-grey');
            $item.addClass('btn-amber');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allPrevBtn.click(function(){
        var curStep = $(this).closest(".setup-content-2"),
            curStepBtn = curStep.attr("id"),
            prevStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().prev().children("a");

        prevStepSteps.removeAttr('disabled').trigger('click');
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content-2"),
            curStepBtn = curStep.attr("id"),
            nextStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i< curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepSteps.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel-2 div a.btn-amber').trigger('click');
});

function eseguiregistrazione(){
    var username = $('#formUsername').val();
    var password = $('#formPassword').val();
    var password2 = $('#formConfermaPassword').val();
    var email = $('#formEmail').val();
    var email2 = $('#formConfermaEmail').val();
    var nome = $('#formNome').val();
    var cognome = $('#formCognome').val();
    var sesso = $('#formSesso').val();
    var codicefiscale = $('#formCodFisc').val();
    var telefono = $('#formTelefono').val();
    var codicestatocivile = $('#statocivile').val();
    var datanascita = $('#date-picker-example').val();
    var provincianascita = $('#listaprovincenascita').val();
    var codicecomunenascita = $('#listacomunenascita').val();
    var comunenascita = $("#listacomunenascita option[value='" + codicecomunenascita + "']").text();
    var codiceprovinciaresidenza = $("#listaprovinceresidenza").val();
    var provinciaresidenza = $("#listaprovinceresidenza option[value='" + codiceprovinciaresidenza + "']").text();
    var codicecomuneresidenza = $('#listacomuneresidenza').val();
    var indirizzo = $('#formIndirizzo').val();
    var comuneresidenza = $("#listacomuneresidenza option[value='" + codicecomuneresidenza + "']").text();
    var codicestatocivile = $("#statocivile").val();
    var statocivile = $("#statocivile option[value='" + codicestatocivile + "']").text();
    //Validazione campi

    /*if (password != password2) {
        alert("La password confermata è diversa da quella scelta, controllare.");
        document.password2.value = "";
    }
    if (email != email2) {
        alert("L'email confermata è diversa da quella scelta, controllare.");
        document.email2.value = "";
    }
    var selectsesso = $('#formSesso').val();
    var optionsesso = $('option:selected', selectsesso);
    if (!optionsesso[0].value) {
        alert("Devi scegliere un sesso.");
    }
    var selectstatocivile = $('#statocivile').val();
    var optionstatocivile = $('option:selected', selectstatocivile);
    if (!optionstatocivile[0].value) {
    }
    var selectcomunenascita = $('#listacomunenascita').val();
    var optioncomunenascita = $('option:selected', selectcomunenascita);
    if (!optioncomunenascita[0].value) {
    }
    var selectcomuneresidenza = $('#listacomuneresidenza').val();
    var optioncomuneresidenza = $('option:selected', selectcomuneresidenza);
    if (!optioncomuneresidenza[0].value) {
        alert("Devi selezionare una Provincia e un Comune di residenza.");
        return false;
    }*/

    var sendObject = {
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
        url: "http://192.168.125.24:3001/auth/registrazione",
        data: JSON.stringify(sendObject),
        dataType: "json",
        contentType: 'application/json',
        success: function (data, textStatus, jqXHR) {
            alert(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
}