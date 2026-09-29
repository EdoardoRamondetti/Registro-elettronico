<?php
 	require ('./environment.php');
 	require './mysqli.php';	
	require './phpMailer/PHPMailer.php';
	require './phpMailer/SMTP.php';
	require './phpMailer/Exception.php';

	session_start();

    $destinatario = checkParams("destinatario");
    $utente = checkParams("utente");

	$_SESSION["utenteCambiaPsw"] = $utente;
	
	$newPasswordInChiaro = "Nuova_password";
	$newPassword = md5($newPasswordInChiaro);

    $conn = OpenConnection();
    $sql = "UPDATE studenti SET pass = '$newPassword' WHERE user = '$utente'";
    $data = ExecuteQuery($conn, $sql);
    http_response_code(200);
    echo(json_encode($data));
    $conn->close();
	
	// Lettura del file message.html
	$body="This is your new password: " . $newPasswordInChiaro;
	$filename = 'message.html';
	$f = fopen($filename, 'r');
	if ($f) {
		$body = fread($f, filesize($filename));
		$body = str_replace("__password", $newPasswordInChiaro, $body);
		fclose($f);
	}
		
	// Istanza di PHP Mailer	
	$mailer = new PHPMailer\PHPMailer\PHPMailer(true);  //true abilita l'eccezioni
	// debugging: 1 = errors and messages, 2 = messages only
    $mailer->IsSMTP(); // enable SMTP

	// Configurazione del protocollo SMTP
    $mailer->SMTPDebug = 1; 
	$mailer->Host = 'smtp.gmail.com';	
	$mailer->SMTPSecure = 'tls';
	$mailer->Port = 587;	

    ini_set('display_errors', 1);
    error_reporting(E_ALL);
 	
	// Impostazione delle Credenziali di accesso al server
	$mailer->SMTPAuth = true; // Utilizo Auth semplice con user+pass
	$mailer->Username = GMAIL_ADDRESS;
	$mailer->Password = GMAIL_PASSWORD;

	
	// Impostazione della mail
	$mailer->setFrom(GMAIL_ADDRESS, "Edoardo Ramondetti");
	$mailer->addAddress($destinatario);

	$mailer->Subject = 'New Password';
	$mailer->isHTML(true);  // Set email format to HTML
	$mailer->Body = $body;
	$mailer->AltBody ='This is the body in plain text for non-HTML mail clients';	


	// per alcuni errori passa nel catch, altre volte restituisce false
	try{
		if ($mailer->send()){
			http_response_code(200);	
			echo (json_encode('Message sent !'));
		}
		else {	
			http_response_code(550);  // mail error
			die ("Errore PHPMailer: " . $mailer->ErrorInfo);
		}
	}
	catch (Exception $e) {
		http_response_code(550);
		die ("Errore PHPPPMailer: " . $mailer->ErrorInfo);
    }	
?>