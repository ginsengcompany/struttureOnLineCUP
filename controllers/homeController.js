let aziende = require('../utils/aziende');
let request = require('request');
exports.getHome = function (req, res, next) {
    let aziendaParameter = req.params.azienda;
    let aziendaEsistente = false;
    if(!aziende.hasOwnProperty(aziendaParameter)){
        return res.render('error',{
            error:{
                status: 404
            },
            message: "Azienda ospedaliera non trovata"
        });
    }
    let options = {
        method: 'GET',
        uri: 'http://ecuptservice.ak12srl.it/infostruttura',
        headers:{
            struttura: aziende[aziendaParameter]
        },
        json : true
    };
    request(options,function (err, response, body) {
        if (err)
            return res.render('error',{
                error:{
                    status: 500
                },
                message: "Servizio momentaneamente non disponibile"
            });
        res.render('home',{datiAzienda:body,parametroAzienda:aziendaParameter});
    });

};