<?php
$connn = null;
// TIMEOUT deve essere espressa in secondi quindi 1 ora = 3600
define("TIMEOUT", 600);

function OpenConnection()
{
    //  Quando cambiamo esercizio bisognerà cambiare il name del db
    //  es. "people"/"automobili"/ ecc.
    define("DB_NAME", "registroelettronico");

    // Nel caso in cui MySql sia su un'altra macchina
    // al posto di localhost metto l'indirizzo IP della macchina in cui è contenuto/installato il database
    define("DB_HOST", "localhost");

    //  My_ql quando crea il database, crea automaticamente un utente chiamato root con una password vuota
    //  Noi ci colleghiamo al database con il nome utente root
    define("DB_USER", "root");

    //  Noi ci colleghiamo al database con password vuota ("")
    define("DB_PASS", "");

    //  Serve ad abilitare il Try e Catch che per default non è abilitato 
    //  Viene eseguita una volta e poi vale per sempre 
    //  Quindi da qui in poi possiamo usare il try e catch
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    try {
        //  Instanzia una nuova connessione al database people
        //  Gli passiamo DB_HOST/DB_USER/DB_PASS/DB_NAME
        global $conn;
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        //  Il charset è il set di caratteri che il server deve utilizzare per comunicare con il database
        $conn->set_charset("utf8mb4");
        //  Instanziamo una connessione al database e poi la returniamo
        return $conn;
    } catch (mysqli_sql_exception $err) {
        //  Se non riesce a connettersi al database mi ritorna un errore 503
        //  cioè errore connessione database
        http_response_code(503);
        //  Per accedere ai metodi agli object in php si usa la freccina ->
        //  die stampa il messaggio e termina lo script
        die("<b>Errore connessione al database </b>" . $err->getMessage());
    }
}

function ExecuteQuery($conn, $sql)
{
    try {
        //  Query è un metodo dell'oggetto $conn
        //  E' un metodo che esegue una query cioè va nel databse e mi restituisce i dati
        //  E' un metodo che restituisce i dati sotto forma di recordset PHP
        //  che è un oggetto che contiene i dati e che quindi dobbiamo convertire in un vettore enumerativo di json
        $result = $conn->query($sql);
        //  In tutte le chimate diverse dalla GET
        //  PHP restituisce true se è andato tutto bene e false se si è verificato qualche errore
        //  Quindi convertiamo i dati in un vettore enumerativo di json solo nel caso di una chimata get
        //  Se la chiamata è una get allora convertiamo i dati in un vettore enumerativo di json
        //  Perchè in caso di un'altra chimata restituisce true e false e non un dataset PHP

        //  Verifico se $result è un bool
        //  Se non è un bool allora è un dataset PHP
        //  e quindi devo convertire i dati in un vettore enumerativo di json
        //  Se invece è un bool allora non è una chiamata GET
        //  e quindi non devo convertire i dati in un vettore enumerativo di json
        if (!is_bool($result)) {
            //  Converto da dataset PHP a un vettore enumerativo di json
            //  ma solo nel caso di una chiamata GET
            $data = $result->fetch_all(MYSQLI_ASSOC);
        } else {
            $data = $result;
        }
        return $data;
    } catch (mysqli_sql_exception $err) {
        //  Incaso di errore chiudo la connessione e chiudo lo script
        $conn->close();
        //  L'errore generico dell'esecuzione della query è 500
        http_response_code(500);
        die("<b>Errore query </b>" . $err->getMessage());
    }
}

function CheckParams($param): mixed
{
    //  Il vettore $REQUEST contiene sia i parametri post e get

    //  Verifichiamo se il parametro inserito all'interno del vettore $ _REQUEST esiste
    if (isset($_REQUEST[$param])) {
        //  fa il return del valore del controllo
        return $_REQUEST[$param];
    } else {
        //  l'errore 400 è l'errore nel caso di parametri mancanti
        http_response_code(400);
        //  In PHP per accedere alle variabili globali bisogna mettere global
        //  Sennò lui ne crea una nuova non assegnata chiamata $conn
        global $conn;
        if ($conn)
            $conn->close();
        die("Parametro $param mancante");
    }
}

function checkSession()
{
    // accede alla sessione e se non c'è ne crea una nuova
    session_start();
    // se c'è la scadenza impostata e se la sessione non è scaduta
    if (isset($_SESSION['scadenza']) && time() < $_SESSION['scadenza']) {
        $_SESSION['scadenza'] = time() + TIMEOUT;
        setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");
    } else {
        // se la sessione non esiste o e scaduta la distrugge
        session_unset();
        session_destroy();
        // mettiamo un cookie a -1 per far in modo che il browser non lo rimandi indietro visto che è scaduto
        // sennò il browser lo manderebbe indietro 
        setcookie(session_name(), '', -1, '/');
        http_response_code(403);
        die("Sessione scaduta");
    }
}

?>