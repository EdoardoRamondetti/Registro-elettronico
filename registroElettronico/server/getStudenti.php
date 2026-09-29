<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$classe = checkParams("classe");
$sql = "SELECT * FROM studenti s WHERE s.classe = '$classe'";
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>