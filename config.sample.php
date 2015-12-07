<?php
    $_host = '127.0.0.1';
	$_port = '3306';
	$_user = 'root';
	$_pass = '';
	$_database = 'lost_and_found';

	$_conn = mysqli_connect($_host . ':' . $_port, $_user, $_pass, false);
	mysqli_select_db($_conn, $_database) or die(mysqli_error($_conn));
?>
