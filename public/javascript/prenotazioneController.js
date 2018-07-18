$( "#rowCodiceImpegnativa1" ).hide();
$( "#rowCodiceImpegnativa2" ).hide();
$( "#rowAutoFill" ).hide();
$( "#rowBottoneInvio" ).hide();
$('#barra').hide();
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

function invioPrenotazione() {
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
            sessionStorage.setItem("datiPrenotazione", data);
            window.location.href = "verificaContenutoImpegnativa";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalPrenotazione').text(jqXHR.responseText);
            $('#centralModalAlert').modal('show');
            $("#invioPrenotazione" ).prop( "disabled", false );
            $('#barra').hide();
        }
    });
}