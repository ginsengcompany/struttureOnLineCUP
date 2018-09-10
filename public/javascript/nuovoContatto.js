//Inizializza lo stepper
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
let navListItems, allWells, nextBtn, allPrevBtn, btnRegistrati;
let datiLuogoNascita = {
    provincia: "",
    codprovincia: "",
    comune: "",
    codcomune: ""
};
navListItems = $('div.setup-panel-2 div a');
allWells = $('.setup-content-2');
nextBtn = $('#btnForm1');
btnRegistrati = $("#btnregistrazione");
allPrevBtn = $('.prevBtn-2');
allWells.hide();
//Gestisce l'avanzamento dello stepper
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
//Gestisce il retrocedere dello stepper
allPrevBtn.click(function(){
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        prevStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().prev().children("a");
    prevStepSteps.removeAttr('disabled').trigger('click');
});
//Controlla l'inserimento dei dati nella form e passa allo stepper successivo
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
            if(!datiLuogoNascita.codcomune){
                isValid = false;
                $("#comunenascitaHelp").fadeIn();
                if(!datiLuogoNascita.codprovincia && $('#formCodFisc').val().toUpperCase()[11] !== "Z")
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
//Trigger del click sul button per visualizzare il primo step
$('div.setup-panel-2 div a.btn-amber').trigger('click');
//$('#btn-step-3').trigger('click');

$(document).ready(function () {
    $('#formCodFisc').val('');
    $('.mdb-select').material_select();
    let selectStatoCivile = $("#statocivile");
    //Popola la select dello stato civile
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
    //Popola la select delle province di residenza
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
    //Gestisce l'evento on change della select relativa alla lista di province di residenza
    $('#listaprovinceresidenza').on('change', function () {
        let selectComuneResidenza = $("#listacomuneresidenza");
        let send = {codIstat: this.value};
        //Popola la select dei comuni di residenza
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
    let oggi = new Date();
    let minDate = new Date(oggi.getUTCFullYear() - 118, 0, 1);
    $("#date-picker-example").pickadate({
        monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        weekdaysFull: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        showMonthsShort: undefined,
        showWeekdaysFull: undefined,
        clear: 'Cancella',
        close: 'Chiudi',
        today: 'Oggi',
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
        min: minDate,
        max: new Date()
    });
    //Gestisce l'evento input sull'input text relativa al codice fiscale
    $("#formCodFisc").on('input', function () {
        //Se il codice fiscale inserito è formato da 16 caratteri
        if($("#formCodFisc").val().length === 16){
            //Invia il codice fiscale e ottiene i dati da inserire nel resto della form
            $.ajax({
                type: "POST",
                url: window.location.href + "/codicefiscaleinverso",
                data: JSON.stringify({
                    cod : $("#formCodFisc").val().toUpperCase()
                }),
                dataType: "json",
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {
                    if(data.codcatastale[0] === "Z"){ //nato all'estero
                        $.ajax({
                            type: "POST",
                            url: window.location.href + "/getCodCatZ",
                            data: JSON.stringify({
                                cod : data.codcatastale
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            success : function (data2, textStatus, jqXHR) {
                                $("#codice-fiscaleHelp").fadeOut();
                                datiLuogoNascita.comune = data2.descrizione.toUpperCase();
                                datiLuogoNascita.codcomune = data2.codcatastale;
                                $("#date-picker-example").val(data.datanascita);
                                $("#listaprovincenascita").val("");
                                $("#listacomunenascita").val(data2.descrizione);
                                $("#formSesso").val(data.sesso);
                                $(".campicompilati").addClass("active");
                                $(".hideinit").show();
                                $(".provnascita").hide();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                $("#codice-fiscaleHelp").fadeIn();
                                $(".hideinit").hide();
                                datiLuogoNascita = {
                                    provincia: "",
                                    codprovincia: "",
                                    comune: "",
                                    codcomune: ""
                                };
                            }
                        })
                    }
                    else { //nato in italia
                        $.ajax({
                            type: "POST",
                            url: window.location.href + "/getByCodCat",
                            data: JSON.stringify({
                                cod : data.codcatastale
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            success : function (data2, textStatus, jqXHR) {
                                $("#codice-fiscaleHelp").fadeOut();
                                datiLuogoNascita.provincia = data2.provincia.toUpperCase();
                                datiLuogoNascita.codprovincia = data2.codice;
                                datiLuogoNascita.comune = data2.nome.toUpperCase();
                                datiLuogoNascita.codcomune = data2.codIstat;
                                $("#date-picker-example").val(data.datanascita);
                                $("#listaprovincenascita").val(data2.provincia);
                                $("#listacomunenascita").val(data2.nome);
                                $("#formSesso").val(data.sesso);
                                $(".campicompilati").addClass("active");
                                $(".hideinit").show();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                $("#codice-fiscaleHelp").fadeIn();
                                $(".hideinit").hide();
                                datiLuogoNascita = {
                                    provincia: "",
                                    codprovincia: "",
                                    comune: "",
                                    codcomune: ""
                                };
                            }
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#codice-fiscaleHelp").fadeIn();
                    $(".hideinit").hide();
                    datiLuogoNascita = {
                        provincia: "",
                        codprovincia: "",
                        comune: "",
                        codcomune: ""
                    };
                }
            });
        }
        else
            $(".hideinit").hide();
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
//Gestisce il click sul button aggiugni nuovo contatto
btnRegistrati.click(function() {
    //Controllo campi form 2
    let curForm = $(this).closest(".setup-content-2");
    let formParameters = curForm.find("input[type='text'],input[type='url'],input[type='password'],input[type='email'],input[type='checkbox'],select");
    let isValid = true;
    //Controlla i dati inseriti
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
        /*
        else if(formParameters[i].id === 'formEmail') {
             if(!formParameters[i].validity.valid){
                 isValid = false;
                 $("#emailHelp").fadeIn();
             }else
                 $("#emailHelp").fadeOut();
         }*/
    }
    if(isValid){//Se tutto ok
        //dati anagrafici
        let nome = $('#formNome').val().toUpperCase();
        let cognome = $('#formCognome').val().toUpperCase();
        let codicefiscale = $('#formCodFisc').val().toUpperCase();
        let datanascita = $('#date-picker-example').val();
        let provincianascita = datiLuogoNascita.provincia;
        let codicecomunenascita = datiLuogoNascita.codcomune;
        let comunenascita = datiLuogoNascita.comune;
        let sesso = $('#formSesso').val().toUpperCase();
        let codicestatocivile = $('#statocivile').val().toUpperCase();
        let statocivile = $("#statocivile").find("option[value='" + codicestatocivile + "']").text().toUpperCase();
        //dati personali
        let email = $('#formEmail').val().toLowerCase();
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
        //REST aggiungi nuovo contatto
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
                        window.location.href = 'rubrica';
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