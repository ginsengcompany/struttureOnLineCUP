$(document).ready(function () {
    $(".button-collapse").sideNav();
    
    $('.datepicker').pickadate({
        monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        weekdaysFull: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        showMonthsShort: undefined,
        showWeekdaysFull: undefined,
        today: 'Oggi',
        clear: 'Cancella',
        close: 'Chiudi',
        firstDay: 1,
        format: 'dd/mm/yyyy',
        formatSubmit: 'dd/mm/yyyy',
        labelMonthNext: 'Mese successivo',
        labelMonthPrev: 'Mese precedente',
        labelMonthSelect: 'Seleziona un mese',
        labelYearSelect: 'Seleziona un anno'
    });
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
    $('#listaprovincenascita').on('change', function () {
        var selectComuneNascita = $("#listacomunenascita");
        var send = {codIstat: this.value};
        $.ajax({
            type: "POST",
            url:"http://192.168.125.24:3001/comuni/listacomuni",
            data: JSON.stringify(send),
            dataType:"json",
            contentType:'application/json',
            success: function (data, textStatus, jqXHR) {
                $('#listacomunenascita').material_select('destroy');
                $('#listacomunenascita').find('option').remove();
                selectComuneNascita.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                for (var i = 0; i < data.length; i++){
                    selectComuneNascita.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                }
                $('#listacomunenascita').material_select();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });
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
        var selectProvinceResidenza = $("#listaprovinceresidenza");
        $.ajax({
            type: "GET",
            url: "http://192.168.125.24:3001/comuni/listaprovince",
            dataType : "json",
            contentType : 'plain/text',
            success: function (data, textStatus, jqXHR) {
                $('select[name="listaprovince"]').material_select('destroy');
                for (var i = 0; i < data.length; i++) {
                    selectProvinceResidenza.append('<option value="' + data[i].codIstat + '">' + data[i].provincia + '</option>');
                }
                $('select[name="listaprovince"]').material_select();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
        $('#listaprovinceresidenza').on('change', function () {
            var selectComuneResidenza = $("#listacomuneresidenza");
            var send = {codIstat: this.value};
            $.ajax({
                type: "POST",
                url:"http://192.168.125.24:3001/comuni/listacomuni",
                data: JSON.stringify(send),
                dataType:"json",
                contentType:'application/json',
                success: function (data, textStatus, jqXHR) {
                    $('#listacomuneresidenza').material_select('destroy');
                    $('#listacomuneresidenza').find('option').remove();
                    selectComuneResidenza.append('<option value="" disabled="" selected="">' + "Seleziona il comune" + '</option>');
                    for (var i = 0; i < data.length; i++){
                        selectComuneResidenza.append('<option value="' + data[i].codice + '">' + data[i].nome + '</option>');
                    }
                    $('#listacomuneresidenza').material_select();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        });
});