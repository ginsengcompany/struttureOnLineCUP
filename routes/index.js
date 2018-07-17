let express = require('express');
let router = express.Router();
let indexController = require('../controllers/indexController');
let registrazioneController = require('../controllers/registrazioneController');
let appuntamentiController = require('../controllers/appuntamentiController');
let homeController = require('../controllers/homeController');
let prenotazioneController = require('../controllers/prenotazioneController');
let rubricaController = require('../controllers/rubricaController');
let verificaContenutoImpegnativaController = require('../controllers/verificaContenutoImpegnativaController');

/* GET LOGIN */
router.get('/:azienda/login',indexController.getLogin);

/* GET REGISTRAZIONE */
router.get('/:azienda/registrazione', registrazioneController.getRegistrazione);

/* GET PRENOTAZIONE */
router.get('/:azienda/prenotazione', prenotazioneController.getPrenotazione);

/* GET RUBRICA */
router.get('/:azienda/rubrica', rubricaController.getRubrica);

/* GET APPUNTAMENTI */
router.get('/:azienda/appuntamenti', appuntamentiController.getAppuntamenti);

/* GET VERIFICA CONTENUTO IMPEGNATIVA */
router.get('/:azienda/verificaContenutoImpegnativa', verificaContenutoImpegnativaController.getContenutoImpegnativa);

/* GET HOME */
router.get('/:azienda/home', homeController.getHome);

router.post('/:azienda/login', indexController.postLogin);

router.get('/:azienda/logout', indexController.logout);

module.exports = router;
