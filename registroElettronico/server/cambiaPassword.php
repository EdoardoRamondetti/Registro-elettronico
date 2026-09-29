<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");

session_start();

$utente = $_SESSION["utenteCambiaPsw"] ?? null;

if($utente == null)
    die("Utente non trovato");

$passw = CheckParams("passwordAttuale");
$pswAttuale = md5($passw);
$psw = md5(checkParams("password"));

$conn = OpenConnection();

$sql = "SELECT * FROM studenti 
        WHERE user = '$utente' AND pass = '$pswAttuale'";

$data = ExecuteQuery($conn, $sql);

if (count($data) == 0)
{
    http_response_code(401);
    die("Password errata");
}

$conn = OpenConnection();

$sql = "UPDATE studenti SET pass = '$psw' WHERE user = '$utente'";
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>