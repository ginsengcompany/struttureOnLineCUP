let aziende = require('../utils/aziende');

exports.getRegistrazione = function (req, res, next) {
    aziendaParameter = req.params.azienda;
    let aziendaEsistente = false;
    if(!aziende.hasOwnProperty(aziendaParameter)){
        return res.render('error',{
            error:{
                status: 404
            },
            message: "Page not found"
        });
    }
    res.render('registrazione');
};