$( "#rowCodiceImpegnativa1" ).hide();
$( "#rowCodiceImpegnativa2" ).hide();
$( "#rowAutoFill" ).hide();
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
        headers: {
            "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZmVkNWM2Mjc1MTNiN2ZiYjI5Yjc2MCIsImlhdCI6MTUzMTI5NTc3M30.BQGMg3W-bhpziOSRotEOAnazPLSsWyIlFridkhBbo_s"
        },
        url: "http://192.168.125.24:3001/auth/me",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
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
                /*let result = data.findIndex(function(object) {
                    return object.nomeCompletoConCodiceFiscale === nomeSelezionato;
                });*/
                    $("#nomeAutofill").val(data[nomeSelezionato].nome);
                    $("#cognomeAutofill").val(data[nomeSelezionato].cognome);
                    $("#codiceFiscaleAutofill").val(data[nomeSelezionato].codice_fiscale);
                });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    $('#codiceImpegnativa1').on('input',function (){
        if($('#codiceImpegnativa1').val().length > 5) {
            $('#labelcodiceImpegnativa1').text("Inserisci il codice SAR");
            $("#rowCodiceImpegnativa2").hide();
        }
        else if($('#codiceImpegnativa1').val().length === 5) {
            $("#rowCodiceImpegnativa2").show();
        }
        else {
            $('#labelcodiceImpegnativa1').text("Inserisci il codice Impegnativa");
            $("#rowCodiceImpegnativa2").hide();
        }
    });
    /*let selectNominativiPlaceholder = ["Giancarlo Magalli", "Fabrizi Frizzi", "Carlo Conti", "Flavio Insinna"];
    $('.mdb-select').material_select('destroy');
    for (let i = 0; i < selectNominativiPlaceholder.length; i++) {
        selectNome.append('<option value="' + selectNominativiPlaceholder[i] + '">' + selectNominativiPlaceholder[i] + '</option>');
    }*/
    /*$('#selectNominativo').on('change', function () {
        let nomeSelezionato = $( "#selectNominativo option:selected" ).text();
        let result = data.findIndex(function(object) {
            return object.nomeCompletoConCodiceFiscale === nomeSelezionato ;
        });
        console.log(result);
        $("#nomeAutofill").val(nomeSelezionato);
        $("#cognomeAutofill").val(nomeSelezionato);
        $("#codiceFiscaleAutofill").val(nomeSelezionato);
    });*/
});