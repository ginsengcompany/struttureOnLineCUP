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
    console.log(parametriLogin.username);
    parametriLogin.password = $('#materialFormPassword').val();
    $.ajax({
        type: "POST",
        url: "http://192.168.125.24:3001/auth/login",
        data: JSON.stringify(parametriLogin),
        dataType : "json",
        contentType : 'application/json',
        success: function (data, textStatus, jqXHR) {
            console.log(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}