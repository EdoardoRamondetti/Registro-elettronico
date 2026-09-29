<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$matricola = checkParams("matricola");
$data = checkParams("data");
$sql = "INSERT INTO assenze (matricola,data,giustificato) 
VALUES ($matricola,'$data',0)";
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>