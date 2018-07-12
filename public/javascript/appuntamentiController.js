$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.mdb-select').material_select();

    let selectNome = $("#selectContatto");
    $.ajax({
        type: "GET",
        headers: {
            "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZmVkNWM2Mjc1MTNiN2ZiYjI5Yjc2MCIsImlhdCI6MTUzMTI5NTc3M30.BQGMg3W-bhpziOSRotEOAnazPLSsWyIlFridkhBbo_s"
        },
        url: "http://192.168.125.24:3001/auth/me",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona Assistito" + '</option>');
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
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
});
