<?php
header('Content-type:application/json; charset=utf-8');
session_start();
session_unset();
session_destroy();
setcookie(session_name(),"",-1,"/");
http_response_code(200);
echo (json_encode("ok"));
?>