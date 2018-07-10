var express = require('express');
var router = express.Router();
/* GET rubrica page. */
router.get('/', function(req, res) {
    res.render('rubrica');
});

module.exports = router;