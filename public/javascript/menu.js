$(document).ready(function () {
    $(".button-collapse").sideNav();
});

$("#btnmodalLogout").click(function () {
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

$("#sitegesan").click(function () {
    window.open("https://www.gesan.it/","_blank");
});

$("#siteak12").click(function () {
    window.open("http://www.ak12srl.it","_blank");
});

$("#btnmodalElimAccountConferma").click(function () {
    let passwordConferma = $("#modalPasswordElimAccount").val();
    if (!passwordConferma || !passwordConferma.trim())
        return;
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