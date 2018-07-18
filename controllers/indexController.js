let request = require('request');
let aziende = require('../utils/aziende');

exports.postLogin = function (req, res, next) {
    let options = {
        method: 'POST',
        uri: 'http://ecuptservice.ak12srl.it/auth/login',
        body: {
            username: req.body.username,
            password: req.body.password
        },
        json : true
    };
    request(options,function (err, response, body) {
        if(err)
            return res.status(500).send("Il servizio è momentaneamente non disponibile");
        req.session.auth = true;
        res.status(200).send(body);
    });
};

exports.getLogin = function (req, res, next) {
    let aziendaParameter = req.params.azienda;
    let aziendaEsistente = false;
    if(!aziende.hasOwnProperty(aziendaParameter)){
        return res.render('error',{
            error:{
                status: 404
            },
            message: "Page not found"
        });
    }
    let options = {
        method: 'GET',
        uri: 'http://ecuptservice.ak12srl.it/infostruttura',
        headers:{
            struttura: aziende[aziendaParameter]
        },
        json : true
    };
    request(options,function (err, response, body) {
        if (err)
            return res.render('error',{
                error:{
                    status: 500
                },
                message: "Servizio momentaneamente non disponibile"
            });
        res.render('index',{datiAzienda:body,parametroAzienda:aziendaParameter});
    });
};

exports.logout = function (req, res, next) {
    delete req.session.auth;
    res.status(200).send("logout");
};