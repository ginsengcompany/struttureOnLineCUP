var express = require('express');
var router = express.Router();

/* GET verificaContenutoImpegnativa page. */
router.get('/', function(req, res, next) {
    res.render('verificaContenutoImpegnativa');
});

module.exports = router;