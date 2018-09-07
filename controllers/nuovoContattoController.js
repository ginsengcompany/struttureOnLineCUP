let strutture = require('../models/strutture');
let request = require('request');
let uri = require('../bin/url');

/*
La funzione renderizza la pagina per inserire un nuovo contatto nella lista contatti.
 */
exports.getNuovoContatto = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        res.render('nuovoContatto',{datiAzienda:str,parametroAzienda:req.params.azienda, pagetitle: "Nuovo contatto"});
    });
};

/*
La funzione effettua una REST al servizio dell'ecupt per aggiungere un nuovo contatto nella lista dei contatti
del care giver
 */
exports.addContact = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        let options = {
            method: 'POST',
            uri: 'http://ecuptservice.ak12srl.it/auth/aggiungiContatto',
            headers:{
                "x-access-token" : req.session.tkn
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
La funzione effettua una REST verso il servizio dell'ecupt che passato il codice fiscale
restituisce tutte le informazioni ricavabili da esso
 */
exports.convertiCodFisc = function (req, res) {
    if (!req.body.hasOwnProperty("cod"))
        return res.status(400).send("Dati mancanti");
    let options = {
        method: 'GET',
        uri: uri.convertiCodFisc,
        headers:{
            codfisc : req.body.cod
        },
        json : true
    };
    request(options, function (err, response, body) {
        if(err && (response.statusCode === 400 || response.statusCode === 417))
            return res.status(response.statusCode).send(body);
        else if(err)
            return res.status(500).send("Il servizio è momentaneamente non disponibile");
        res.status(200).send(body);
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a fornire i comuni della provincia contenuta nel body
 */
exports.getLuogoNascitaByCodCat = function (req, res) {
    if (!req.body.hasOwnProperty("cod"))
        return res.status(400).send("Dati mancanti");
    let options = {
        method : 'GET',
        uri: uri.luogonascitaConCodCat + '?codcatastale=' + req.body.cod,
        json : true
    };
    request(options,function (err, response, body) {
        if(err && (response.statusCode === 500 || response.statusCode === 404))
            return res.status(response.statusCode).send(response.responseText);
        else if(err)
            return res.status(500).send("Il servizio è momentaneamente non disponibile");
        res.status(200).send(body);
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a fornire una lista delle nazioni
e restituisce la nazione di nascita a cui si riferisce il codice fiscale dell'assistito
 */
exports.getLuogoNascitaEstero = function (req, res) {
    if (!req.body.hasOwnProperty("cod"))
        return res.status(400).send("Dati mancanti");
    let options = {
        method : 'GET',
        uri: uri.luogonascitaEstero,
        json : true
    };
    request(options,function (err, response, body) {
        if(err && (response.statusCode === 500 || response.statusCode === 404))
            return res.status(response.statusCode).send(response.responseText);
        else if(err)
            return res.status(500).send("Il servizio è momentaneamente non disponibile");
        for(let i=0;i < body.length;i++){
            if (body[i].codiceCatastale === req.body.cod){
                let sendObject = {
                    codcatastale : body[i].codiceCatastale,
                    descrizione : body[i].descrizione
                };
                return res.status(200).send(sendObject);
            }
        }
        res.status(404).send("Luogo di nascita non trovato");
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