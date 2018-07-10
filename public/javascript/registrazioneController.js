$(document).ready(function () {
    $('.mdb-select').material_select();
    var selectProvinceNascita = $("#listaprovincenascita");
    $('.mdb-select').material_select('destroy');
    $.ajax({
        type: "GET",
        url: "http://192.168.125.24:3001/comuni/listaprovince",
        dataType : "json",
        contentType : 'plain/text',
        success: function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++) {
                selectProvinceNascita.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            $('.mdb-select').material_select();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    var selectComuniNascita = $("#listacomunenascita");
    $('#listacomunenascita').material_select('destroy');
    $.ajax({
        type: "GET",
        url:"",
        dataType:"",
        contentType:"",
        success: function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++){
                selectComuniNascita.append('<option value="' + data[i]. + '">' + data[i]. + '</option>');
            }
            $('.mdb-select').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
});