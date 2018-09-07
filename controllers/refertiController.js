let strutture = require('../models/strutture');
let request = require('request');
let uri = require('../bin/url');

/*
La funzione renderizza la pagina per consultare i referti del car giver e dei suoi contatti
 */
exports.getReferti = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        res.render('referti',{datiAzienda:str,parametroAzienda:req.params.azienda, pagetitle: "Referti"});
    });
};

/*
La funzione effettua una REST al servizio ecupt per ricevere i contatti del care giver
 */
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

/*
La funzione effettua una REST al servizio dell'ecupt rivolto a fornire la lista dei referti
 */
exports.getListaRefertiAssistito = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);

        let options = {
            method: 'POST',
            uri: uri.listaRefertiURL,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura,
                cf : req.headers.cf
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

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a fornire il referto codificato in base 64
 */
exports.scaricaReferto = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.scaricaRefertoURL,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura,
                id : req.headers.id
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

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a inviare il referto selezionato con una mail
all'indirizzo di posta elettronica del care giver
 */
exports.inviaemail = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: uri.inviarefertoemail,
            headers:{
                "x-access-token" : req.session.tkn,
                struttura : str.codice_struttura,
            },
            body: {
                datiEmail: {
                    url : str.variabili_logicaDati.repositoryReferti + req.body.id,
                    email : req.body.email,
                    nome : req.body.nome,
                    cognome : req.body.cognome
                }
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