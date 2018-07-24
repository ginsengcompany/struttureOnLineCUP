let strutture = require('../models/strutture');
let request = require('request');

exports.primaDisponibilita = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let sendObject = [];
        for(let i = 0; i < req.body.length; i++){
            sendObject.push({
                codprest: req.body[i].prestazione.codprest,
                reparti: req.body[i].reparti
            });
        }
        let options = {
            method: 'POST',
            uri: 'http://ecuptservice.ak12srl.it/ricercaprimadisponibilita',
            headers:{
                "x-access-token" : req.session.tkn,
                struttura:str.codice_struttura
            },
            body: sendObject,
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            res.status(response.statusCode).send(body);
        });
    });
};