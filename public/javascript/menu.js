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