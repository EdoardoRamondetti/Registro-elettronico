<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();

$classe = checkParams("classe");
$conn = OpenConnection();

$sql = "SELECT materie FROM classi WHERE nome = '$classe'";
$data = ExecuteQuery($conn, $sql);

$materieJson = $data[0]['materie'];

//trasforma json in arrya php
$materieArray = json_decode($materieJson, true);
//.join con ','
$materieList = implode(',', $materieArray);

$sql2 = "SELECT * FROM materie WHERE id IN ($materieList)";
$materie = ExecuteQuery($conn,$sql2);

http_response_code(200);
echo json_encode($materie);

$conn->close();
?>
