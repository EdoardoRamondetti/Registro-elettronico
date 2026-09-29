<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$idAssenza = $_REQUEST["idAssenza"];
$sql = "UPDATE assenze SET giustificato = 1 WHERE id = $idAssenza ";

$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>