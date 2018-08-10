$('#tableReferti').hide();
$('#barra').hide();
let tabellaReferti;
$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.mdb-select').material_select();
    let selectNome = $("#selectContatto");
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('.mdb-select').material_select('destroy');
            data.sort(function (a, b) {
                return (a.nomeCompletoConCodiceFiscale > b.nomeCompletoConCodiceFiscale) ? 1 : ((b.nomeCompletoConCodiceFiscale > a.nomeCompletoConCodiceFiscale) ? -1 : 0);
            });
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona Assistito" + '</option>');
            for (let i = 0; i < data.length; i++) {
                selectNome.append('<option value="' + i + '">' + data[i].nomeCompletoConCodiceFiscale + '</option>');
            }
            $('.mdb-select').material_select();
            $('#selectContatto').on('change', function () {
                let nomeSelezionato = $("#selectContatto option:selected").val();
                console.log(nomeSelezionato);
                $('#labelNessunReferto').hide();
                $('#barra').show();
                $('#colTableReferti').hide();

                $.ajax({
                    type: "POST",
                    headers: {'cf': data[nomeSelezionato].codice_fiscale},
                    url: window.location.href + "/listareferti",
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
                        $('#barra').hide();
                        $('#colTableReferti').show();
                        $('#tableReferti').show();
                        tabellaReferti = $('#tableReferti').DataTable({
                            destroy: true,
                            responsive: true,
                            language: {
                                url: '../localisation/it-IT.json'
                            },
                            data: data.listaReferti,
                            columns: [
                                {
                                    data: "metadati.dataDocumento"
                                },
                                {
                                    data: "metadati.desDocumento"
                                },
                                {
                                    data: "metadati.desEvento"
                                },
                                {
                                    data: "metadati.autoreDocumento"
                                },
                                {
                                    data: null,
                                    render: function (data, type, row) {
                                        return '<button type="button" class="btn btn-color-primary btn-sm btn-rounded">Apri</button><button type="button" class="btn btn-color-primary btn-sm btn-rounded">Invia Email</button>'
                                    },
                                    targets: [4],
                                }
                            ],
                            columnDefs: [
                                {
                                    targets: '_all',
                                    defaultContent: 'Non Disponibile',
                                    render: function (data) {
                                        if (data === "")
                                            return 'Non Disponibile';
                                        else {
                                            return data
                                        }
                                    },
                                },
                            ],
                        });
                        $('#tableReferti tbody').on('click', 'button', function () {
                            let data = tabellaReferti.row($(this).parents('tr')).data();
                            let idFile = data.id;
                            $.ajax({
                                type: "POST",
                                headers: {'id': idFile},
                                url: window.location.href + "/scaricareferti",
                                success: function (data, textStatus, jqXHR) {
                                    let link = data + idFile;
                                    window.location = link;
                                },
                                error: function (jqXHR, textStatus, errorThrown) {

                                }
                            });
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $('#colTableRefert').hide();
                        $('#barra').hide();
                        $('#labelNessunReferto').text("Nessun referto per l'assistito selezionato");
                        $('#labelNessunReferto').show();

                    }
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
});