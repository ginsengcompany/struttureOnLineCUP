$('#rowcard').hide();
$(document).ready(function () {
    $('#imglogo').addClass('animated fadeInDown');
    setTimeout(function () {
        $('#rowcard').show();
        $('#rowcard').addClass('animated rubberBand')
    }, 1000);
    $('#loginForm').submit(function () {
        eseguiLogin();
        return false;
    });
});

function eseguiLogin() {
    var parametriLogin ={
        username : String,
        password : String
    };
    parametriLogin.username = $('#materialFormUsername').val();
    parametriLogin.password = $('#materialFormPassword').val();
    $.ajax({
        type: "POST",
        url: "http://ecuptservice.ak12srl.it/auth/login",
        data: JSON.stringify(parametriLogin),
        dataType : "json",
        contentType : 'application/json',
        success: function (data, textStatus, jqXHR) {
            if(data.auth){
                localStorage.setItem('tkn',data.token);
                window.location.href = '/menu';
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
}