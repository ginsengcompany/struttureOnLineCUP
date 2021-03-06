let strutture = require('../models/strutture');
let uri = require('../bin/url');
let request = require('request');

/*
La funzione renderizza la pagina verificaContenutoImpegnativa
 */
exports.getContenutoImpegnativa = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        res.render('verificaContenutoImpegnativa',{datiAzienda:str,parametroAzienda:req.params.azienda});
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto al controllo di quali prestazioni contenute
nell'impegnativa sono erogabili dalla struttura
 */
exports.getPrestazioniErogabili = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.controlloPrestazioniURL,
            body: req.body,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura
            },
            json : true
        };
        request(options, function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            let prest_erogabili = [], prest_non_erogabili = [];
                if (!body.erogabile)
                    prest_non_erogabili.push(body);
                else
                    prest_erogabili.push(body);
            return res.status(response.statusCode).send({prestazioni_erogabili:prest_erogabili,prestazioni_non_erogabili: prest_non_erogabili});
        });
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto alla ricerca dei reparti per una singola prestazione
erogabile
 */
exports.getReparti = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.ricercaRepartiURL,
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

//La funzione viene utilizzata dalle funzioni precedenti per gli stati d'errore della rotta
function handleError(stato,res) {
    res.status(stato.status).render('error',{
        error:{
            status: stato.status
        },
        message: stato.message
    });
}