$(document).ready(function () {
    $('.mdb-select').material_select();
    var selectProvinceNascita = $("#listaprovincenascita");
    $.ajax({
        type: "GET",
        url: "http://192.168.125.24:3001/comuni/listaprovince",
        dataType : "json",
        contentType : 'plain/text',
        success: function (data, textStatus, jqXHR) {
            $('select[name="listaprovince"]').material_select('destroy');
            for (var i = 0; i < data.length; i++) {
                selectProvinceNascita.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
            }
            $('select[name="listaprovince"]').material_select();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    /*$('.mdb-select').material_select();
    var selectComuniNascita = $("#listacomunenascita");
    $('#listacomunenascita').material_select('destroy');
    $.ajax({
        type: "GET",
        url:"",
        dataType:"json",
        contentType:'plain/text',
        success: function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++){
                selectComuniNascita.append('<option value="' + data[i]. + '">' + data[i]. + '</option>');
            }
            $('.mdb-select').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });*/
    var selectStatoCivile = $("#statocivile");
    $.ajax({
        type: "GET",
        url:"http://192.168.125.24:3001/statocivile",
        dataType:"json",
        contentType:'plain/text',
        success: function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++){
                selectStatoCivile.append('<option value="' + data[i].id + '">' + data[i].descrizione + '</option>');
            }
            $('#statocivile').material_select();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
});