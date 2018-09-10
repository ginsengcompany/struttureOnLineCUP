let request = require('request');
let strutture = require('../models/strutture');
let uri = require('../bin/url');

/*
Alcuni le funzioni prima di eseguire le relative operazioni controllano se la struttura passata come parametro in query
esiste nel DB, ciò protegge la rotta a cui la funzione è associata
 */

/*
La funzione viene invocata quando l'utente vuole effettuare l'accesso al portale.
La funzione effettua una REST al servizio di login dell'ecupt
 */
exports.postLogin = function (req, res, next) {
    let options = {
        method: 'POST',
        uri: uri.loginURL,
        body: {
            username: req.body.username,
            password: req.body.password
        },
        json : true
    };
    request(options,function (err, response, body) {
        if(err)
            return res.status(500).send("Il servizio è momentaneamente non disponibile");
        req.session.auth = body.auth;
        if(body.auth)
            req.session.tkn = body.token;
        res.status(200).send(body);
    });
};

/*
La funzione renderizza la pagina di login del portale
 */
exports.getLogin = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"},res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"},res);
        if(req.session.auth)
            delete req.session.auth;
        res.render('index',{datiAzienda:str,parametroAzienda:req.params.azienda, pagetitle: "Login"});
    });
};

/*
La funzione esegue il redirect alla rotta che renderizza la pagina di login
 */
exports.redirectToLogin = function (req, res, next) {
   res.redirect("/" + req.params.azienda  + "/login");
};

/*
La funzione effettua il logout dell'utente e rimuove la proprietà auth
che identifica l'autenticazione dell'utente dalla sessione
 */
exports.logout = function (req, res, next) {
    delete req.session.auth;
    res.status(200).send("logout");
};

/*
La funzione effettua una REST verso il servizio ecupt che invia una mail con allegato il file contenente i dati del care giver e dei suoi contatti
salvati sul DB, la mail viene inviata all'indirizzo di posta elettronica del care giver
 */
exports.downloadMe = function (req, res, next) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"}, res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"}, res);
        let options = {
            method: 'GET',
            uri: uri.downloadMe,
            headers: {
                "x-access-token" : req.session.tkn
            }
        };
        request(options, function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            res.send(response.body);
        });
    });
};

/*
La funzione effettua la REST al servizio dell'ecupt rivolto all'eliminazione dell'intero account del care giver.
Quest'azione rimuove ogni dato relativo all'account considerato.
 */
exports.elimAccount = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"}, res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"}, res);
        let options = {
            method: 'GET',
            uri: uri.eliminaAccountURL,
            headers:{
                "x-access-token" : req.session.tkn
            },
            json : true
        };
        request(options,function (err, response, body) {
            if(err)
                return res.status(500).send("Il servizio è momentaneamente non disponibile");
            delete req.session.auth;
            res.status(response.statusCode).send(body);
        });
    });
};

/*
La funzione effettua una REST verso il servizio dell'ecupt rivolto a confermare la password inviata dal care giver, tutto
ciò per autenticare il care giver prima di eseguire un operazione importante sui suoi dati
 */
exports.checkMe = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({status: 500, message: "Il servizio è momentaneamente non disponibile"},res);
    strutture.findOne({denominazioneUrl : req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"}, res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"}, res);
        let options = {
            method: 'POST',
            uri: uri.checkme,
            headers:{
                "x-access-token" : req.session.tkn
            },
            body:{
                password : req.body.password
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

exports.recPass = function (req, res) {
    if (strutture.db._readyState !== 1) return handleError({
        status: 500,
        message: "Il servizio è momentaneamente non disponibile"
    }, res);
    strutture.findOne({denominazioneUrl: req.params.azienda}, function (err, str) {
        if (err) return handleError({status: 503, message: "Il servizio è momentaneamente non disponibile"}, res);
        if (!str) return handleError({status: 404, message: "Azienda Ospedaliera non trovata"}, res);
        let options = {
            method: 'POST',
            uri: uri.recPass,
            body: {
                email: req.body.mail
            },
            json: true
        };
        request(options, function (err, response, body) {
            if (err)
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