<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
$conn = OpenConnection();
$user = checkParams("user");
$pass = checkParams("pass");
// evita sql injection
$user = $conn->real_escape_string($user);
$pass = $conn->real_escape_string($pass);

$sql = "SELECT * FROM studenti 
        WHERE user = '$user'";
$data = ExecuteQuery($conn, $sql);
if (count($data) == 0)
{
    http_response_code(401);
    die("Username errato");
}

else if($data["docente"] == 1){
    http_response_code(403);
    die("accesso non consentito");
}
else
{
    $dbpass = $data[0]["pass"];
    if ($dbpass != $pass)
    {
        http_response_code(401);
        die("Password errata");
    }
    else
    {
        session_start();
        $_SESSION["scadenza"] = time() + TIMEOUT;
        // questa chiave serve a identificare il correntista
        $_SESSION["matricola"] = $data[0]["matricola"];
        setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");
        http_response_code(200);
        echo(json_encode("ok"));    
    }
}
$conn->close();
?>