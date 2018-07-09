var express = require('express');
var router = express.Router();

/* GET registrazione page. */
router.get('/', function(req, res) {
    res.render('registrazione');
});

module.exports = router;
