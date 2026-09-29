<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$matricola = checkParams("matricola");
$data  = checkParams("data");
$sql = "SELECT * FROM assenze a INNER JOIN studenti s ON s.matricola = a.matricola  WHERE a.data = '$data'
AND a.matricola = $matricola";
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>