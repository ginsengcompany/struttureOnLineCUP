let strutture = require('../models/strutture');
let request = require('request');
let uri = require('../bin/url');

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a restituire la prima disponibilità a partire dal
giorno corrente per ogni singola prestazione erogabile
 */
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
            uri: uri.primaDisponibilitaURL,
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

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a fornire in blocco le prime disponibilità partendo
dalla data più piccola presente nel body
 */
exports.invioProssimaDisponibilita = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.ricercaOrarioURL,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura:str.codice_struttura
            },
            body: req.body,
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            let propostaModificata = false;
            for(let i=0;i < req.body.appuntamenti.length && !propostaModificata; i++){
                for (let j=0; j < body.appuntamenti.length; j++){
                    if(body.appuntamenti[j].codprest === req.body.appuntamenti[i].codprest){
                        if((body.appuntamenti[j].dataAppuntamento + "" + body.appuntamenti[j].oraAppuntamento) !== (req.body.appuntamenti[i].dataAppuntamento + "" + req.body.appuntamenti[i].oraAppuntamento)){
                            propostaModificata = true;
                            break;
                        }
                    }
                }
            }
            res.status(propostaModificata ? response.statusCode : 449).send(body);
        });
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a fornire in blocco le prime disponibilità partendo
dalla data di ricerca presente nel body
 */
exports.invioRicercaData = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.ricercaDataURL,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura:str.codice_struttura,
                dataricerca: req.headers.dataricerca
            },
            body: req.body,
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            res.status(response.statusCode).send(body);
        });
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a confermare l'appuntamento o gli appuntamenti
presenti nell'impegnativa
 */
exports.confermaPrenotazione = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.confermaAppuntamentoURL,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura:str.codice_struttura,
            },
            body: req.body,
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            res.status(response.statusCode).send(body);
        });
    });
};