let strutture = require('../models/strutture');
let request = require('request');
let uri = require('../bin/url');

exports.getAppuntamenti = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        res.render('appuntamenti',{datiAzienda:str,parametroAzienda:req.params.azienda, pagetitle: "Lista appuntamenti"});
    });
};

exports.getContatti = function (req,res,next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'GET',
            uri: uri.authMeURL,
            headers:{
                "x-access-token" : req.session.tkn
            },
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            res.status(response.statusCode).send(body);
        });
    });
};

exports.getListaAppuntamentiAssistito = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);

        let options = {
            method: 'POST',
            uri: uri.listaAppuntamentiURL,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura
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

exports.annullaImpegnativa = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.annullaImpegnativaWebURL,
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
            if(response.statusCode === 502 || response.statusCode === 200)
                return res.status(200).send("L'impegnativa è ora disponibile");
            res.status(response.statusCode).send(body);
        });
    });
};

function handleError(stato,res) {
    res.status(stato.status).render('error',{
        error:{
            status: stato.status
        },
        message: stato.message
    });
}