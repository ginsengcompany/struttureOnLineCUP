let express = require('express');
let router = express.Router();
let indexController = require('../controllers/indexController');
let registrazioneController = require('../controllers/registrazioneController');
let appuntamentiController = require('../controllers/appuntamentiController');
let homeController = require('../controllers/homeController');
let prenotazioneController = require('../controllers/prenotazioneController');
let rubricaController = require('../controllers/rubricaController');
let verificaContenutoImpegnativaController = require('../controllers/verificaContenutoImpegnativaController');
let nuovoContatto = require('../controllers/nuovoContattoController');
let introController = require('../controllers/introController');
let propostaRichiestaController = require('../controllers/propostaRichiestaController');
let refertiController = require('../controllers/refertiController');

/* LOGIN E LOGOUT */
router.get('/:azienda/login',indexController.getLogin);
router.post('/:azienda/login', indexController.postLogin);
router.get('/:azienda/logout', indexController.logout);

/* REGISTRAZIONE */
router.get('/:azienda/registrazione', registrazioneController.getRegistrazione);
router.post('/:azienda/registrazione/codicefiscaleinverso', registrazioneController.convertiCodFisc);
router.post('/:azienda/registrazione/getByCodCat', registrazioneController.getLuogoNascitaByCodCat);
router.post('/:azienda/registrazione/getCodCatZ', registrazioneController.getLuogoNascitaEstero);

/* PRENOTAZIONE */
router.get('/:azienda/prenotazione', prenotazioneController.getPrenotazione);
router.get('/:azienda/prenotazione/contatti', prenotazioneController.getContatti);
router.post('/:azienda/prenotazione/datiImpegnativa', prenotazioneController.invioDatiImpegnativa);

/* VERIFICA CONTENUTO IMPEGNATIVA */
//router.get('/:azienda/verificaContenutoImpegnativa', verificaContenutoImpegnativaController.getContenutoImpegnativa);
router.post('/:azienda/prenotazione/prestazioniErogabili', verificaContenutoImpegnativaController.getPrestazioniErogabili);
router.post('/:azienda/prenotazione/prelevaReparti', verificaContenutoImpegnativaController.getReparti);

/* Proposta Richiesta */
router.post('/:azienda/prenotazione/primaDisponibilita', propostaRichiestaController.primaDisponibilita);
router.post('/:azienda/prenotazione/prossimaDisponibilita', propostaRichiestaController.invioProssimaDisponibilita);
router.post('/:azienda/prenotazione/ricercaData', propostaRichiestaController.invioRicercaData);
router.post('/:azienda/prenotazione/confermaPrenotazione',propostaRichiestaController.confermaPrenotazione);

/* RUBRICA */
router.get('/:azienda/rubrica', rubricaController.getRubrica);
router.get('/:azienda/rubrica/contatti', rubricaController.getContatti);
router.post('/:azienda/rubrica/eliminaContatto', rubricaController.deleteContact);
router.get('/:azienda/rubrica/eliminaAccount', rubricaController.deleteAccount);
router.post('/:azienda/rubrica/modificaContatto', rubricaController.reviewContact);

/* NUOVO CONTATTO */
router.get('/:azienda/nuovoContatto', nuovoContatto.getNuovoContatto);
router.post('/:azienda/nuovoContatto', nuovoContatto.addContact);
router.post('/:azienda/nuovoContatto/codicefiscaleinverso', nuovoContatto.convertiCodFisc);
router.post('/:azienda/nuovoContatto/getByCodCat', nuovoContatto.getLuogoNascitaByCodCat);
router.post('/:azienda/nuovoContatto/getCodCatZ', nuovoContatto.getLuogoNascitaEstero);

/* APPUNTAMENTI */
router.get('/:azienda/appuntamenti', appuntamentiController.getAppuntamenti);
router.get('/:azienda/appuntamenti/contatti', appuntamentiController.getContatti);
router.post('/:azienda/appuntamenti/ListaAppuntamenti', appuntamentiController.getListaAppuntamentiAssistito);
router.post('/:azienda/appuntamenti/annullaimpegnativa', appuntamentiController.annullaImpegnativa);

/* REFERTI */
router.get('/:azienda/referti', refertiController.getReferti);
router.get('/:azienda/referti/contatti', refertiController.getContatti);
router.post('/:azienda/referti/listareferti', refertiController.getListaRefertiAssistito);
router.post('/:azienda/referti/scaricareferti', refertiController.scaricaReferto);

/* HOME */
router.get('/:azienda/home', homeController.getHome);

/* INTRO */
router.get('/', introController.getIntro);

module.exports = router;
