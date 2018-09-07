$('#tableReferti').hide();
$('#barra').hide();
let tabellaReferti;
let datiInvioEmail = {
    id: "",
    email: "",
    nome: "",
    cognome: ""
};
let contatti;
$("#centralModalAlert").on("hidden.bs.modal", function () {
    $('#barra').hide();
});
$(document).ready(function () {
    $('.mdb-select').material_select();
    let selectNome = $("#selectContatto");
    //REST per ricevere la lista dei contatti
    $.ajax({
        type: "GET",
        url: window.location.href + "/contatti",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            //Popola la select dei contatti
            $('.mdb-select').material_select('destroy');
            data.sort(function (a, b) {
                return (a.nomeCompletoConCodiceFiscale > b.nomeCompletoConCodiceFiscale) ? 1 : ((b.nomeCompletoConCodiceFiscale > a.nomeCompletoConCodiceFiscale) ? -1 : 0);
            });
            selectNome.append('<option value="" disabled="" selected="">' + "Seleziona Assistito" + '</option>');
            for (let i = 0; i < data.length; i++) {
                selectNome.append('<option value="' + i + '">' + data[i].nomeCompletoConCodiceFiscale + '</option>');
            }
            $('.mdb-select').material_select();
            contatti = data;
            //Gestisce l'evento on change sulla select dei contatti
            $('#selectContatto').on('change', function () {
                let nomeSelezionato = $("#selectContatto option:selected").val();
                $('#labelNessunReferto').hide();
                $('#barra').show();
                $('#colTableReferti').hide();
                //REST per ottenere la lista dei referti relativi al contatto scelto
                $.ajax({
                    type: "POST",
                    headers: {'cf': data[nomeSelezionato].codice_fiscale},
                    url: window.location.href + "/listareferti",
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (data, textStatus, jqXHR) {
                        $('#barra').hide();
                        $('#colTableReferti').show();
                        $('#tableReferti').show();
                        tabellaReferti = $('#tableReferti').DataTable({
                            destroy: true,
                            responsive: {
                                details: {
                                    type: 'column'
                                }
                            },
                            language: {
                                url: '../localisation/it-IT.json'
                            },
                            data: data.listaReferti,
                            columns: [
                                { //button visualizza la riga in dettaglio se lo schermo non renderizza per intero la tabella
                                    className: 'details-control',
                                    orderable: false,
                                    width: 30,
                                    data: null,
                                    defaultContent: ''
                                },
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
                                { //button per inviare il referto per mail e per visualizzare il referto in pdf
                                    data: null,
                                    render: function (data, type, row) {
                                        return '<button type="button" class="btn btn-color-primary btn-sm btn-rounded scaricaPDF">Apri</button><button type="button" data-toggle="modal" data-target="#centralModalAlert" class="btn btn-color-primary btn-sm btn-rounded emailPDF">Invia Email</button>'
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
                        //Evento del click sul pulsante scarica per visualizza il pdf nel browser
                        $('#tableReferti tbody').on('click', '.scaricaPDF', function () {
                            $("#barra").show();
                            let data = tabellaReferti.row($(this).parents('tr')).data();
                            let idFile = data.id;
                            $.ajax({
                                type: "POST",
                                headers: {'id': idFile},
                                url: window.location.href + "/scaricareferti",
                                success: function (data, textStatus, jqXHR) {
                                    let link = data + idFile;
                                    $("#barra").hide();
                                    window.location = link;
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    $("#barra").hide();
                                }
                            });
                        });
                        //Evento del click sul pulsante invia mail per visualizzare il modal per inviare il referto via mail
                        $('#tableReferti tbody').on('click', '.emailPDF', function () {
                            datiInvioEmail = {
                                id: "",
                                email: "",
                                nome: "",
                                cognome: ""
                            };
                            $("#barra").show();
                            let data = tabellaReferti.row($(this).parents('tr')).data();
                            let idFile = data.id;
                            let nomeSelezionato = $("#selectContatto option:selected").val();
                            datiInvioEmail.id = idFile;
                            datiInvioEmail.nome = contatti[nomeSelezionato].nome;
                            datiInvioEmail.cognome = contatti[nomeSelezionato].cognome;
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

//Gestore del click sul button del modal per inviare il referto via mail
$('#btninvioemail').on('click', function () {
    $("#barra").show();
    datiInvioEmail.email = $("#formEmail").val();
    //REST per inviare il referto
    $.ajax({
        type: "POST",
        dataType: "text",
        contentType: 'application/json',
        url: window.location.href + "/inviaemail",
        data: JSON.stringify(datiInvioEmail),
        success: function (data, textStatus, jqXHR) {
            $("#barra").hide();
            datiInvioEmail = {
                id: "",
                email: "",
                nome: "",
                cognome: ""
            };
            $('#pInfo').text("Email inviata correttamente");
            $('#centralInfo').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#barra").hide();
            console.log(jqXHR.status);
            datiInvioEmail = {
                id: "",
                email: "",
                nome: "",
                cognome: ""
            };
            $('#pInfo').text("Errore durante l'invio dell'email");
            $('#centralInfo').modal('show');
        }
    });
});