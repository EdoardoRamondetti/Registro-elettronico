<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$classe = checkParams("classe");
$materia = checkParams("materia");
$dataPlanning = checkParams("data");
if($materia == "" && $dataPlanning == "")
    $sql = "SELECT * FROM argomenti WHERE classe = '$classe'";
else{
    if($dataPlanning == "" && $materia != "")
        $sql = "SELECT * FROM argomenti WHERE classe = '$classe' AND materia = $materia";
    else{
        if($dataPlanning != "" && $materia == "")
            $sql = "SELECT * FROM argomenti WHERE classe = '$classe' AND data = '$dataPlanning'";
        else if($dataPlanning != "" && $dataPlanning != "")
                $sql = "SELECT * FROM argomenti WHERE classe = '$classe' AND data = '$dataPlanning' AND materia = $materia";
    }
}

$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>