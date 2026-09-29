<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$matricola = checkParams("matricola");
$data = checkParams("data");
$voto = checkParams("voto");
$materia = checkParams("materia");
$sql = "INSERT INTO voti (matricola,data,materia,voto)
VALUES ($matricola,'$data',$materia,$voto)";
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>