var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('prenotazione');
});

router.get('/verificaContenutoImpegnativa', function(req, res) {
    res.render('verificaContenutoImpegnativa');
});

module.exports = router;