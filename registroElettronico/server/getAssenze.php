<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
$conn = OpenConnection();
$matricola = checkParams("matricola");
$tipoAssenza = checkParams("tipoAssenza");
$data = checkParams("data");
if($tipoAssenza == "all" && $data == "all"){
    $sql = "SELECT * FROM assenze WHERE matricola = $matricola";
}
else{
    if($tipoAssenza == "giustificate" && $data == "all")
        $sql = "SELECT * FROM assenze WHERE matricola = $matricola AND giustificato = 1";
    else{
        if($tipoAssenza == "giustificate" && $data != "all")
            $sql = "SELECT * FROM assenze WHERE matricola = $matricola AND data = '$data' AND giustificato = 1";
        else{
             if($tipoAssenza == "non-giustificate" && $data == "all")
                $sql = "SELECT * FROM assenze WHERE matricola = $matricola AND giustificato = 0";
             else{
                if($tipoAssenza == "non-giustificate" && $data != "all")
                    $sql = "SELECT * FROM assenze WHERE matricola = $matricola AND data = '$data' AND giustificato = 0";
                else
                    $sql = "SELECT * FROM assenze WHERE matricola = $matricola AND data = '$data'";
             }
        }
    } 
}
$data = ExecuteQuery($conn, $sql);
http_response_code(200);
echo(json_encode($data));
$conn->close();
?>