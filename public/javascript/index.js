//rende invisibili i loghi
$(".logo_login").hide();
//rende invisibile la card della login
$('#rowcard').hide();
$(document).ready(function () {
    let gdprCookies = Cookies.get('gdpr');
    console.log(gdprCookies);
    if(gdprCookies === '1') {
        $("#gdprBar").hide();
    }
    else
        $("#gdprBar").show();
    //rende visibili e animati i loghi
    $('.logo-login').show();
    $('.logo-login').addClass('animated fadeInDown');
    //dopo 1000 ms rende visibile e animata la card della login
    setTimeout(function () {
        $('#rowcard').show();
        $('#rowcard').addClass('animated rubberBand');
    }, 1000);
    //assegna al submit della form la seguente callback
    $('#loginForm').submit(function () {
        eseguiLogin();
        return false;
    });

    $('#gdprBtnOk').click( function () {
        Cookies.set('gdpr', 1, { expires: 7 });
        $("#gdprBar").remove();
    });
});
//esegue il tentativo di login dell'utente
function eseguiLogin() {
    let parametriLogin ={
        username : String,
        password : String
    };
    parametriLogin.username = $('#materialFormUsername').val();
    parametriLogin.password = $('#materialFormPassword').val();
    $.ajax({
        type: "POST",
        url: window.location.href,
        data: JSON.stringify(parametriLogin),
        dataType : "json",
        contentType : 'application/json',
        success: function (data, textStatus, jqXHR) {
            if(data.auth){
                window.location.href = 'home';
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#paragrafomodalLogin').text(jqXHR.responseText);
            $('#centralModalInfo').modal('show');
        }
    });
}