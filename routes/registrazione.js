let express = require('express');
let router = express.Router();
let registrazioneController = require('../controllers/registrazioneController');

/* GET registrazione page. */
router.get('/:azienda', registrazioneController.getRegistrazione);

module.exports = router;
