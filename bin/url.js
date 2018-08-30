// Constant URL

// URL Login server remoto
const url = {};

let localhost = "http://192.168.125.24:3001";
let serverHost = "http://ecuptservice.ak12srl.it";

let host = localhost;

url.loginURL =                  host + "/auth/login";
url.primaDisponibilitaURL =     host + "/ricercaprimadisponibilita";
url.ricercaOrarioURL =          host + "/ricercaprimadisponibilita/ricercaorario";
url.ricercaDataURL =            host + "/ricercaprimadisponibilita/ricercadata";
url.confermaAppuntamentoURL =   host + "/auth/confermaappuntamento";
url.listaProvinceURL =          "http://ecuptservice.ak12srl.it/comuni/listaprovince";
url.listaComuniURL =            "http://ecuptservice.ak12srl.it/comuni/listacomuni";
url.controlloPrestazioniURL =   host + "/controlloPrestazioni";
url.ricercaRepartiURL =         host + "/ricercareparti";
url.authMeURL =                 host + "/auth/me";
url.eliminaAccountURL =         host + "/auth/eliminaaccount";
url.registrazioneURL =          host + "/auth/registrazione";
url.annullaImpegnativaWebURL =  host + "/auth/annullaImpegnativaWeb";
url.eliminaContattoURL =        host + "/auth/eliminaContatto";
url.modAssistitoURL =           host + "/auth/modAssistito";
url.ricettaURL =                host + "/ricetta";
url.listaAppuntamentiURL =      host + "/auth/listaappuntamenti";
url.statoCivileURL =            host + "/statocivile";
url.listaRefertiURL =           host + "/referti/prelevarefertiutente";
url.scaricaRefertoURL =         host + "/referti/scaricareferto";
url.convertiCodFisc =           host + "/codicefiscaleinverso";
url.luogonascitaConCodCat =     host + "/comuni/getByCodCatastale";
url.luogonascitaEstero =        host + "/nazioni";
url.annullaprenotazionesospesa = host + "/auth/annullaprenotazionesospesaWeb";
url.inviarefertoemail =         host + "/referti/inviarefertoemail";
url.downloadMe =                host + "/auth/downloadMe";
url.checkme =                   host + "/auth/checkMe";

// Exports the variables and above so that other modules can use them
module.exports = url;