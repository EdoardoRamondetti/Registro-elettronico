<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$matricola = $_SESSION["matricola"];
$sql = "SELECT * FROM studenti WHERE matricola = $matricola";
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>