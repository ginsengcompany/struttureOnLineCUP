let express = require('express');
let router = express.Router();
let indexController = require('../controllers/indexController');
let registrazioneController = require('../controllers/registrazioneController');
let appuntamentiController = require('../controllers/appuntamentiController');
let homeController = require('../controllers/homeController');
let prenotazioneController = require('../controllers/prenotazioneController');
let rubricaController = require('../controllers/rubricaController');
let verificaContenutoImpegnativaController = require('../controllers/verificaContenutoImpegnativaController');

/* LOGIN E LOGOUT */
router.get('/:azienda/login',indexController.getLogin);
router.post('/:azienda/login', indexController.postLogin);
router.get('/:azienda/logout', indexController.logout);

/* REGISTRAZIONE */
router.get('/:azienda/registrazione', registrazioneController.getRegistrazione);

/* PRENOTAZIONE */
router.get('/:azienda/prenotazione', prenotazioneController.getPrenotazione);
router.get('/:azienda/prenotazione/contatti', prenotazioneController.getContatti);
router.post('/:azienda/prenotazione/datiImpegnativa', prenotazioneController.invioDatiImpegnativa);

/* RUBRICA */
router.get('/:azienda/rubrica', rubricaController.getRubrica);
router.get('/:azienda/rubrica/contatti', rubricaController.getContatti);

/* APPUNTAMENTI */
router.get('/:azienda/appuntamenti', appuntamentiController.getAppuntamenti);
router.get('/:azienda/appuntamenti/contatti', appuntamentiController.getContatti);
router.post('/:azienda/appuntamenti/ListaAppuntamenti', appuntamentiController.getListaAppuntamentiAssistito);

/* VERIFICA CONTENUTO IMPEGNATIVA */
router.get('/:azienda/verificaContenutoImpegnativa', verificaContenutoImpegnativaController.getContenutoImpegnativa);

/* HOME */
router.get('/:azienda/home', homeController.getHome);

module.exports = router;
