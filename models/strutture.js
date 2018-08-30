let mongoose = require('mongoose');
let struttureSchema = new mongoose.Schema({
    nome_struttura: String, //nome della struttura
    codice_struttura: String, //codice identificativo della struttura
    denominazioneUrl: String, //denominazione della struttura (usato come parametro nell'url)
    logo_struttura: String, //immagine della struttura
    regione: String, //regione a cui appartiene la struttura
    codRegione: String, //codice identificativo della regione
    indirizzo: String, //indirizzo della struttura
    piva: String, //partita iva
    contatto: {
        numero_callCenter: String, //numero telefonico del call center
        email: String //posta elettronica della struttura
    },
    pagamenti: Boolean, //campo che indica se i pagamenti sono abilitati per la struttura
    referti: Boolean, //campo che indica se i referti sono abilitati per la struttura
    variabili_logicaDati: {
        onMoreReparti: Number, //numero che indica come gestire il caso di più reparti per singola prestazione
        onChangeAppuntamento: Number, //numero che indica come gestire il caso di appuntamento cambiato
        prenotazioniInBlocco: Number, //numero che indica se i servizi della struttura gestiscono le prestazioni in blocco
        asl : Boolean, //valore booleano che indica se la struttura è un asl
        host : String, //host dei servizi della struttura
        referti : String, //url del servizio per la lista dei referti
        repositoryReferti : String //url del servizio per ottenere un referto
    },
    url: { //url utilizzati dall'applicazione e-Cupt (url relativi ai servizi messi a disposizione dall'ecupt)
        TerminiServizio : String,
        Ricetta : String,
        StruttureErogatrici : String,
        Registrazione : String,
        Login : String,
        StrutturaPreferita : String,
        RicercadisponibilitaReparti : String,
        PrimaDisponibilita : String,
        InfoPersonali : String,
        AggiungiNuovoContatto : String,
        EliminaContatto : String,
        ListaComuni : String,
        ListaProvince : String,
        ListaStatoCivile : String,
        ConfermaPrenotazione : String,
        prossimaDataDisponibile : String,
        updateTokenNotifiche : String,
        appuntamenti : String,
        PrimaDisponibilitaOra : String,
        ricercadata : String,
        eliminaContattoPersonale : String,
        annullaImpegnativa : String,
        ricezioneDatiPrenotazione : String,
        annullaPrenotazioneSospesa : String,
        spostamentoPrenotazione : String,
        piuReparti : String,
        appuntamentiFuturiEPassati: String,
        comunebycodicecatastale : String,
        annullaImpegnativaWeb : String
    }
});
mongoose.model('strutture', struttureSchema);

module.exports = mongoose.model('strutture');