let datiLuogoNascita = {
    provincia: "",
    codprovincia: "",
    comune: "",
    codcomune: ""
};
//inizializza lo stepper
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
// navListItems : contiene gli elementi DOM relativi ai simboli dello stepper
// allWells : contiene le form del DOM
// nextBtn : si riferisce al button avanti nel primo step
// btnRegistrati : si riferisce al button registrati
//allPrevBtn : Gestisce tutt i button indietro nelle form
let navListItems, allWells, nextBtn, allPrevBtn, btnRegistrati;
navListItems = $('div.setup-panel-2 div a');
allWells = $('.setup-content-2');
nextBtn = $('#btnForm1');
btnRegistrati = $("#btnregistrazione");
allPrevBtn = $('.prevBtn-2');
// rende non visibili tutte le form della pagina
allWells.hide();
//callback relativa al click dei button dello stepper, questi non sono cliccabili dall'utente
//ma vengono gestiti attraverso il click triggerato dal click dei button all'interno delle form
navListItems.click(function (e) {
    e.preventDefault();
    let $target = $($(this).attr('href')), //l'attributo href si riferisce a quale step punta il button dello stepper cliccato
        $item = $(this); //item si riferisce al button dello stepper cliccato
    navListItems.removeClass('btn-amber').addClass('btn-blue-grey');
    $item.addClass('btn-amber');
    allWells.hide(); //nasconde tutte le form
    $target.show(); //rende visibile la form a cui punta
    //$target.find('input:eq(0)').focus();
});
//effettua il click sul primo button dello stepper per visualizzare la prima form
$('div.setup-panel-2 div a.btn-amber').trigger('click');
//gestisce il click sui pulsanti all'interno della form visibile
allPrevBtn.click(function(){
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        prevStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().prev().children("a");
    prevStepSteps.removeAttr('disabled').trigger('click');
});
//funzione di callback per la gestione del click del button avanti del primo step
nextBtn.click(function(){
    /*
    inserisce nelle variabili tutti gli elementi della form per poter eseguire controlli e funzionalità
    curStep : contiene la form visualizzata
    curStepBtn : preleva l'id del button dello step corrente
    nextStepSteps : si riferisce al button dello step successivo
    curInputs : contiene tutti gli elementi della form che l'utente deve compilare
    isValid : variabile booleana utilizzata nei controlli dei campi per conoscere se l'utente ha inserito tutti i campi e se questi sono validi
     */
    let curStep = $(this).closest(".setup-content-2"),
        curStepBtn = curStep.attr("id"),
        nextStepSteps = $('div.setup-panel-2 div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
        curInputs = curStep.find("input[type='text'],input[type='url'],input[type='password'],input[type='email']"),
        isValid = true;
    //ciclo for che opera su tutti gli elementi della form corrente
    for(let i=0; i< curInputs.length; i++){
        //Controllo Username
        if(curInputs[i].id === 'formUsername') {
            if(!(curInputs[i].value.trim().length >= 3 && curInputs[i].value.trim().length <= 16))
            {
                $("#usernameHelp").fadeIn();
                $("#usernameHelp").text("Il nome utente deve essere maggiore di 3 caratteri alfanumerici e minore di 16 caratteri alfanumerici")
            }
            else if(!curInputs[i].validity.valid || curInputs[i].value.trim() === ''){
                isValid = false;
                $("#usernameHelp").fadeIn();
            }else
                $("#usernameHelp").fadeOut();
        }
        //Controllo Password
        else if(curInputs[i].id === 'formPassword') {
            if(!curInputs[i].validity.valid){
                isValid = false;
                $("#passwordHelpBlockMD").addClass('red-text');
            }
            else{
                $("#passwordHelpBlockMD").removeClass('red-text');
            }

        }
        //Controllo Conferma Password
        else if(curInputs[i].id === 'formConfermaPassword'){
            if (!curInputs[i].validity.valid || curInputs[i].value !== $("#formPassword").val()) {
                isValid = false;
                $("#confermaPasswordHelp").text("Le password non corrispondono");
                $("#confermaPasswordHelp").fadeIn();
            }else
                $("#confermaPasswordHelp").fadeOut();
        }
        //Controllo Email
        else if(curInputs[i].id === 'formEmail') {
            if(!curInputs[i].validity.valid){
                isValid = false;
                $("#emailHelp").fadeIn();
            }else
                $("#emailHelp").fadeOut();
        }
        //Controllo Conferma Email
        else if(curInputs[i].id === 'formConfermaEmail'){
            if(!curInputs[i].validity.valid || curInputs[i].value !== $("#formEmail").val()){
                isValid = false;
                $("#confermaEmailHelp").text("Le email non corrispondono");
                $("#confermaEmailHelp").fadeIn();
            }
            else
                $("#confermaEmailHelp").fadeOut();
        }
    }
    //Se l'utente ha rispettato i requisiti di validazione
    if (isValid){
        nextStepSteps.removeAttr('disabled').trigger('click');
    }
});

$(document).ready(function () {
    //mdb-select registrazione
    $('.mdb-select').material_select();
    //preleva le option da inserire nella select stato civile
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
    //chiamata REST per il prelievo delle province
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
    /*
    callback che agisce quando viene selezionata una provincia di residenza, la sua funzione è quella di effettuare
    una chiamata REST per poter popolare la select per i comuni di residenza
     */
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
    $("#formCodFisc").on('input', function () {
        if($("#formCodFisc").val().length === 16){
            $.ajax({
                type: "POST",
                url: window.location.href + "/codicefiscaleinverso",
                data: JSON.stringify({
                    cod : $("#formCodFisc").val().toUpperCase()
                }),
                dataType: "json",
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {
                    if(data.codcatastale[0] === "Z"){ //estero
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
                    else { //italiano
                        $.ajax({
                            type: "POST",
                            url: window.location.href + "/getByCodCat",
                            data: JSON.stringify({
                                cod : data.codcatastale
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            success : function (data2, textStatus, jqXHR) {;
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

//le seguenti callback vengono utilizzate per gestire il click sui button dello stepper
//queste funzioni per lo più servono per gestire la grafica dello stepper come l'animazione
//della linea dello stesso stepper
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

/*
la seguente callback viene invocata quando si effettua il click sul button registrati
 */
btnRegistrati.click(function() {
    /*
    inserisce nelle variabili tutti gli elementi della form per poter eseguire controlli e funzionalità
    curForm : contiene la form visualizzata
    formParameters : contiene tutti gli elementi della form che l'utente deve compilare
    isValid : variabile booleana utilizzata nei controlli dei campi per conoscere se l'utente ha inserito tutti i campi e se questi sono validi
     */
    let curForm = $(this).closest(".setup-content-2");
    let formParameters = curForm.find("input[type='text'],input[type='url'],input[type='password'],input[type='email'],input[type='checkbox'],select");
    let isValid = true;
    //ciclo for che opera su tutti gli elementi della form corrente
    for(let i=0;i<formParameters.length;i++){
        //Controllo nome
        if(formParameters[i].id === "formNome"){
            if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#nomeHelp").fadeIn();
            }
            else
                $("#nomeHelp").fadeOut();
        }
        //Controllo cognome
        else if(formParameters[i].id === "formCognome"){
            if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#cognomeHelp").fadeIn();
            }
            else
                $("#cognomeHelp").fadeOut();
        }
        //Controllo data di nascita
        else if(formParameters[i].id === "date-picker-example"){
            if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#data-nascitaHelp").fadeIn();
            }
            else
                $("#data-nascitaHelp").fadeOut();
        }
        //Controllo codice fiscale
        else if(formParameters[i].id === "formCodFisc"){
            if(!formParameters[i].value || formParameters[i].value.trim() === '' || formParameters[i].value.length !== 16){
                isValid = false;
                $("#codice-fiscaleHelp").fadeIn();
            }
            else
                $("#codice-fiscaleHelp").fadeOut();
        }
        //Controllo provincia e comune di nascita
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
        //Controllo sesso
        else if(formParameters[i].id === "formSesso"){
            if(!formParameters[i].value){
                isValid = false;
                $("#sessoHelp").fadeIn();
            }
            else
                $("#sessoHelp").fadeOut();
        }
        //Controllo stato civile
        else if(formParameters[i].id === "statocivile"){
            if(!formParameters[i].value){
                isValid = false;
                $("#stato-civileHelp").fadeIn();
            }
            else
                $("#stato-civileHelp").fadeOut();
        }
        //Controllo provincia e comune di residenza
        else if(formParameters[i].id === "listacomuneresidenza"){
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
        //Controllo indirizzo
        else if(formParameters[i].id === "formIndirizzo"){
            if(!formParameters[i].value || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#indirizzoHelp").fadeIn();
            }
            else
                $("#indirizzoHelp").fadeOut();
        }
        //Controllo numero di telefono
        else if(formParameters[i].id === "formTelefono"){
            if(!formParameters[i].validity.valid || formParameters[i].value.trim() === ''){
                isValid = false;
                $("#telefonoHelp").fadeIn();
            }
            else
                $("#telefonoHelp").fadeOut();
        }
        //Controllo termini e condizioni
        else if(formParameters[i].id === "checkboxterms"){
            if($("#checkboxterms:checked").length === 0){
                isValid = false;
                $("#terminiHelp").fadeIn();
            }
            else
                $("#terminiHelp").fadeOut();
        }
    }
    if(isValid){
        let username = $('#formUsername').val();
        let password = $('#formPassword').val();
        let password2 = $('#formConfermaPassword').val();
        let email = $('#formEmail').val();
        let email2 = $('#formConfermaEmail').val();
        let nome = $('#formNome').val().toUpperCase();
        let cognome = $('#formCognome').val().toUpperCase();
        let sesso = $('#formSesso').val().toUpperCase();
        let codicefiscale = $('#formCodFisc').val().toUpperCase();
        let telefono = $('#formTelefono').val();
        let codicestatocivile = $('#statocivile').val();
        let datanascita = $('#date-picker-example').val();
        let provincianascita = datiLuogoNascita.provincia;
        let codicecomunenascita = datiLuogoNascita.codcomune;
        let comunenascita = datiLuogoNascita.comune;
        let codiceprovinciaresidenza = $("#listaprovinceresidenza").val();
        let provinciaresidenza = $("#listaprovinceresidenza").find("option[value='" + codiceprovinciaresidenza + "']").text();
        let codicecomuneresidenza = $('#listacomuneresidenza').val();
        let indirizzo = $('#formIndirizzo').val().toUpperCase();
        let comuneresidenza = $("#listacomuneresidenza").find("option[value='" + codicecomuneresidenza + "']").text();
        let statocivile = $("#statocivile").find("option[value='" + codicestatocivile + "']").text();
        //crea l'oggetto da inviare alla REST per la registrazione
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
        //POST registrazione
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
                        window.location.href = 'login';
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