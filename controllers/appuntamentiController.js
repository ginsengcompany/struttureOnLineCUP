let strutture = require('../models/strutture');
let request = require('request');
let uri = require('../bin/url');

/*
Tutte le funzioni prima di eseguire le relative operazioni controllano se la struttura passata come parametro in query
esiste nel DB, ciò protegge la rotta a cui la funzione è associata
 */

// La funzione renderizza la pagina per la lista degli appuntamenti
exports.getAppuntamenti = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        res.render('appuntamenti',{datiAzienda:str,parametroAzienda:req.params.azienda, pagetitle: "Lista appuntamenti"});
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
La funzione effettua una REST verso il servizio ecupt per recuperare e visualizzare all'utente la lista
degli appuntamenti del contatto scelto
 */
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

/*
La funzione effettua una REST verso il servizio ecupt per annullare gli appuntamenti relativi all'impegnativa selezionata.
L'appuntamento o gli appuntamenti possono essere annullati finchè questa non vengono accettati.
Una volta annullato uno o più appuntamenti relativi ad un'impegnativa, se essa non è scaduta può essere di nuovo presa in carico
in tutte le strutture
 */
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

//La funzione viene utilizzata dalle funzioni precedenti per gli stati d'errore della rotta
function handleError(stato,res) {
    res.status(stato.status).render('error',{
        error:{
            status: stato.status
        },
        message: stato.message
    });
}