let request = require('request');
let strutture = require('../models/strutture');
let uri = require('../bin/url');

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

exports.redirectToLogin = function (req, res, next) {
   res.redirect("/" + req.params.azienda  + "/login");
};

exports.logout = function (req, res, next) {
    delete req.session.auth;
    res.status(200).send("logout");
};

function handleError(stato,res) {
    res.status(stato.status).render('error',{
        error:{
            status: stato.status
        },
        message: stato.message
    });
}