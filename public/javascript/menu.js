//Inizializza la side navbar
$(document).ready(function () {
    $(".button-collapse").sideNav();
});
//Gestisce il click sul button di conferma di logout nel modal relativo a questa operazione
$("#btnmodalLogout").click(function () {
    //REST login
    $.ajax({
        type: "GET",
        url: "logout",
        dataType : "text",
        contentType : 'plain/text',
        success: function (data, textStatus, jqXHR) {
            window.location.href = "login";
        }
    });
});
//Gestisce il click del button nel relativo modal per ricevere i dati dell'account via email
$("#btnmodalacceptionconferma").click(function () {
    $.ajax({
        type: 'GET',
        url: "downloadMe",
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            $('#paragrafomodalNavbar').text(data);
            $('#modalinfonavbar').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalNavbar').text(jqXHR.responseText);
            $('#modalinfonavbar').modal('show');
        }
    });
});
//Gestisce il click sulla label del sito della gesan
$("#sitegesan").click(function () {
    window.open("https://www.gesan.it/","_blank");
});
//Gestisce il click sulla label del sito di ak12srl
$("#siteak12").click(function () {
    window.open("http://www.ak12srl.it","_blank");
});
//Gestisce il click sul button elimina account nel relativo modal
$("#btnmodalElimAccountConferma").click(function () {
    let passwordConferma = $("#modalPasswordElimAccount").val();
    if (!passwordConferma || !passwordConferma.trim())
        return;
    //REST per verificare la password inserita nel modal
    $.ajax({
        type: 'POST',
        url: 'checkMe',
        data: JSON.stringify({password: passwordConferma}),
        dataType: "json",
        contentType : 'application/json',
        success: function (data, textStatus, jqXHR) {
            $.ajax({
                type: 'GET',
                url: 'elimAccount',
                dataType: "text",
                success: function (data, textStatus, jqXHR) {
                    $("#paragrafomodalNavbar").text("L'account è stato eliminato con successo, sarai reindirizzato alla pagina iniziale");
                    $('#modalinfonavbar').modal('show');
                    setTimeout(function () {
                        window.location.href = 'login';
                    }, 2000);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#paragrafomodalNavbar").text(jqXHR.responseText);
                    $('#modalinfonavbar').modal('show');
                    $("#modalPasswordElimAccount").val("");
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalNavbar').text(jqXHR.responseText);
            $('#modalinfonavbar').modal('show');
            $("#modalPasswordElimAccount").val("");
        }
    });
});