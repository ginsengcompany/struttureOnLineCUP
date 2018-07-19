let strutture = require('../models/strutture');
let request = require('request');

exports.getContenutoImpegnativa = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        res.render('verificaContenutoImpegnativa',{datiAzienda:str,parametroAzienda:req.params.azienda});
    });
};

exports.getPrestazioniErogabili = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: 'http://192.168.125.24:3001/controlloPrestazioni',
            body: req.body,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura
            },
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            let prest_erogabili = [], prest_non_erogabili = [];
            for(let i=0;i<body.length;i++){
                if (!body[i].erogabile)
                    prest_non_erogabili.push(body[i]);
                else
                    prest_erogabili.push(body[i]);
            }
            return res.status(response.statusCode).send({prestazioni_erogabili:prest_erogabili,prestazioni_non_erogabili: prest_non_erogabili});
        });
    });
};

exports.getReparti = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: 'http://192.168.125.24:3001/ricercareparti',
            body: req.body,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura
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

function handleError(stato,res) {
    res.status(stato.status).render('error',{
        error:{
            status: stato.status
        },
        message: stato.message
    });
}