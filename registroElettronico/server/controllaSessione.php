<?php
header('Content-type:application/json; charset=utf-8');
require("mysqli.php");
checkSession();
http_response_code(200);
echo (json_encode("ok"));
?>