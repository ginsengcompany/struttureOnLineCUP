$(document).ready(function () {
    $(".button-collapse").sideNav();
});

$("#logout").click(function () {
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
