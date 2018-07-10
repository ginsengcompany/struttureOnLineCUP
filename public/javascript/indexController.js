$('#loginForm').submit(function () {
    eseguiLogin();
    return false;
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
        url: "http://192.168.125.24:3001/auth/login",
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