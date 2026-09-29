<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$matricola = checkParams("matricola");
$materia = checkParams("materia");
if($materia == ""){
$sql = "SELECT * FROM voti WHERE matricola = $matricola";
}
else{
$sql = "SELECT * FROM voti WHERE matricola = $matricola AND materia = $materia";
}

$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>